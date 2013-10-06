var passport = require('../auth')

module.exports = function (app) {

  app.get('/login', function (req, res) {
    res.render('login', {
      pretty: true,
      title: 'lectori salutem'
    })
  })

  app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )

  app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })
}
