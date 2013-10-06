var log = require('../logger')
var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var isbn = require('isbn').ISBN
var UserBook = require('../schemas/userbook')

module.exports = function (app) {

  app.get('/books/add',
    ensureLogin('/login'),
    function (req, res) {
      res.render('addbook', {user: req.user, pretty: true})
    }
  )

  app.post('/books/add',
    ensureLogin('/login'),
    function (req, res) {
      var newBook = new UserBook({
        username : req.user.username,
        isbn :  req.body.isbn
      })
      if (req.body.isbn === undefined) {
        res.render('addbook', {
          message: {
            caption: 'ISBN not specified!',
            type: 'danger'
          },
          pretty: true,
          user: req.user
        })
        return
      }
      if (isbn.parse(newBook.isbn)) {
        // isbn is valid
        newBook.save(function (err, newBook) {
          if (err) {
            log.error(err.stack)
            res.render('addbook', {
              message: {
                caption: err.message,
                type: 'danger'
              },
              pretty: true,
              user: req.user
            })
            return
          }

          // res.redirect('/books/' + isbn.hyphenate(newBook.isbn))
          res.redirect('/profile')
        })
      } else {
        res.render('addbook', {
          message: {
            caption: 'Invalid ISBN. Please double-check and try again.',
            type: 'warning'
          },
          pretty: true,
          user: req.user
        })
        return
      }
    }
  )

  app.get('/books/example',
    ensureLogin('/login'),
    function (req, res) {
      res.render('examplebook', {user: req.user})
    }
  )
}
