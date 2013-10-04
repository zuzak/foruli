var log = require('../logger')
var passport = require('../auth')
var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var config = require('../config')
var crypto = require('crypto')

module.exports = function (app) {

  app.get('/login', function (req, res) {
    res.render('login')
  })

  app.post('/login', function (req, res) {
    console.log(req.body)
    var username = req.body.username
    var password = req.body.password

    var secret = config.get('secret')

    var hash = crypto.createHash('sha1').update(secret+password).digest('hex')

    var User = require('../schemas/user')
    User.findOne({'username': username}, function (err, user) {
      if (!user) {
        if (password.length < 8) {
          res.render('login', {message: {
            caption: 'Password too short: please lengthen it.',
            type: 'warning'
          }})
          return
        }

        // user does not exist: register a new account
        var newUser = new User({
          username: username,
          password: hash
        })

        newUser.save(function (err, newUser) {
          if (err) {
            log.error('Unable to save new user ' + username)
            log.error(err.stack)
            res.render('login', {
              message: {
                caption: err.message,
                type: 'danger'
              }
            })
          } else {
            log.info('New user ' + username + ' registered.')
            res.render('login', {
              message: {
                caption: 'User created successfully; now sign in.',
                type: 'success'
              }
            })
          }
        })
      } else {
        log.info('Attempting authentication!')
        log.info(hash)
        if (user.password == hash) {
          // valid user
          res.render('message', {
            msg: 'Wasn\'t this message worth it?',
            header: 'Login successful.',
            type: 'success'
          })
        } else {
          res.render('login', {
          message: {
              caption: 'Incorrect password! Please try again.',
              type: 'danger'
            }
          })
        }
      }
    })
  })
}
