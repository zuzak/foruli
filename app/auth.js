var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var log = require('./logger')
var User = require('./schemas/user')

passport.use(new LocalStrategy(
  function (username, password, done) {
    log.info('Trying to authenticate %s', username)
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        log.warn('Authentication of %s failed (username)', username)
        return done(null, false) // invalid username
      }
      if (!user.validPassword(password)) {
        log.warn('Authentication of %s failed (password)', username)
        return done(null, false) // invalid password
      }
      log.info('Authenticated %s', username)
      return done(null, user) // successful
    })
  }
))

passport.serializeUser(function (user, done) {
  log.info('%s logged in', user.username)
  done(null, user.username)
})

module.exports = passport

log.info('Initialised authentication.')
