var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var UserBooks = require('../schemas/userbook')
var isbn = require('isbn').ISBN

module.exports = function (app) {

  app.get('/books',
    ensureLogin('/login'),
    function (req, res) {
      UserBooks.find({username: req.user.username}, function (err, books) {
        var fmtBooks = [];
        books.forEach(function (book) {
          fmtBooks.push({
            formatted: isbn.hyphenate(book.isbn),
            raw: book.isbn
          })
        })
        res.render('booklist', {
          user: req.user,
          books: fmtBooks,
          pretty: true,
          title: 'Your Books'
        })
      })
    }
  )
}

