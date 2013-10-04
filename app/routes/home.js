var log = require('../logger')
var passport = require('passport')
var ensureLogin = require('connect-ensure-login').ensureLoggedIn

module.exports = function (app) {

  app.get('/', ensureLogin('/login'), function (req, res) {
    res.send('hello world')
  })
}
