var log = require('../logger')
var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var isbn = require('isbn').ISBN
var UserBook = require('../schemas/userbook')

module.exports = function (app) {

  app.get('/books/add',
    ensureLogin('/login'),
    function (req, res) {
      res.render('addbook', {
        user: req.user,
        pretty: true,
        title: 'Add book',
        active: 'books'
      })
    }
  )

  app.post('/books/add',
    ensureLogin('/login'),
    function (req, res) {
      var newBook = new UserBook({
        username : req.user.username,
        isbn :  isbn.asIsbn13(req.body.isbn)
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
        UserBook.findOne({
          username: newBook.username,
          isbn: newBook.isbn
        }, function (err, oldBook) {
          if (oldBook) {
            log.debug('Old book')
            res.render('addbook', {
              message: {
                caption: 'That ISBN is already associated with your account.',
                type: 'warning'
              }
            })
            return
          } else {
            newBook.save(function (err, newBook) {
              if (err) {
                log.error(err.stack)
                res.render('addbook', {
                  message: {
                    caption: err.message,
                    type: 'danger'
                  },
                  pretty: true,
                  user: req.user,
                  title: 'Add book (error!)'
                })
                return
              }
              log.info('%s added by %s', newBook.isbn, newBook.username)
              res.redirect('/books/' + isbn.asIsbn13(newBook.isbn))
            })
          }
        })
      } else {
        res.render('addbook', {
          message: {
            caption: 'Invalid ISBN. Please double-check and try again.',
            type: 'warning'
          },
          pretty: true,
          user: req.user,
          title: 'Add book (error!)'
        })
        log.warn('%d tried to enter an invalid ISBN.', res.user.username)
        return
      }
    }
  )

  app.get('/books/example',
    ensureLogin('/login'),
    function (req, res) {
      res.render('examplebook', {
        user: req.user,
        pretty: true,
        title: 'Example'
      })
    }
  )
}
