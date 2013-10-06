var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var User = require('../schemas/user')
var UserBooks = require('../schemas/userbook')

module.exports = function (app) {

  app.get('/profile',
    ensureLogin('/login'),
    function (req, res) {
      UserBooks.find({username: req.user.username}, function (err, books) {
        console.log(books)
        res.render('profile', {
          user: req.user,
          books: books,
          pretty: true,
          title: 'Your Profile'
        })
      })
    }
  )

  app.get('/profile/edit',
    ensureLogin('/login'),
    function (req, res) {
      res.render('editprofile', {
        user: req.user,
        pretty: true,
        title: 'Edit Profile'
      })
    }
  )

  app.post('/profile/edit',
    ensureLogin('/login'),
    function (req, res) {
      User.findOne({'username': req.user.username }, function (err, user) {
        user.email = req.body.email
        user.save(function (err, user) {
          res.render('profile', {
            user: req.user,
            pretty: true,
            title: 'Your Profile'
          })
        })
      })
    }
  )
}

