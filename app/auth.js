/*
 * auth.js
 *
 * Contains the code required to:
 * - log in a user
 * - log out a user
 * - register a new user
 * - (de)serialise a user
 *
 * Note that logging a user in should be as simple as possible: the login and
 * registration forms are the same: if a user doesn't exist, just create a new
 * one and let them in.
 *
 */
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var log = require('./logger')
var User = require('./schemas/user')
var config = require('./config')
var crypto = require('crypto')
var app = require('./')

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
  function (username, password, done) {
    var secret = config.get('secret')
    password = crypto.createHash('sha1').update(secret+password).digest('hex')

    User.findOne({'username': username}, function (err, user) {
      if (!user) {
        // user does not exist
        var newUser = new User({
          username: username,
          password: password
        })

        newUser.save(function (err, newUser) {
          if (err) {
            log.warn('Unable to save new registration for %s', username)
            log.error(err.stack)
            return done('Registration error', false)
          } else {
            log.info('Completed registration for %s', username)
            return done(null, newUser)
          }
        })

      } else if (user.password == password) {
        // user is valid
        log.info('%s completed login successfully', username)
        return done(null, user)

      } else {
        // invalid password
        log.warn('Invalid password for %s received', username)
        return done(null, false)
      }
    })
  }
))

passport.serializeUser(function (user, done) {
  log.debug('%s   serialized.', user.username)
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  log.debug('%s deserialized.', user.username)
  done(null, user)
})

module.exports = passport

log.info('Initialised authentication.')
