var ensureLogin = require('connect-ensure-login').ensureLoggedIn

module.exports = function (app) {

  app.get('/notes',
    ensureLogin('/login'),
    function (req, res) {
      res.render('noteswelcome', {
        user: req.user,
        pretty: true,
        title: 'lectori salutem'
      })
    }
  )
}
