var ensureLogin = require('connect-ensure-login').ensureLoggedIn

module.exports = function (app) {

  app.get('/',
    ensureLogin('/login'),
    function (req, res) {
      res.render('welcome', {
        user: req.user,
        pretty: true,
        title: 'lectori salutem'
      })
    }
  )
}
