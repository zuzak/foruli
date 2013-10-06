var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var UserBooks = require('../schemas/userbook')

module.exports = function (app) {

  app.get('/books',
    ensureLogin('/login'),
    function (req, res) {
      UserBooks.find({username: req.user.username}, function (err, books) {
        res.render('booklist', {
          user: req.user,
          books: books,
          pretty: true,
          title: 'Your Books'
        })
      })
    }
  )
}

