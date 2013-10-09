var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var oL = 'http://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:'
var request = require('request')
var UserBook = require('../schemas/userbook')
var aberprimo = require('aberprimo')

module.exports = function (app) {

  app.get('/books/:isbn/api',
    function (req, res) {
      request.get(oL + req.params.isbn, function (e, r, b) {
        var data = JSON.parse(b)
        data = data['ISBN:' + req.params.isbn]
        res.json(data)
      })
    }
  )

  app.get('/books/:isbn',
    ensureLogin('/login'),
    function (req, res) {
      request.get(oL + req.params.isbn, function (e, r, b) {
        var data
        try {
            data = JSON.parse(b)
        } catch (e) {
          res.render('message',{
            header: 'Unable to parse upstream API',
            body: e.stack,
            type: 'danger'
          })
          return
        }
        data = data['ISBN:' + req.params.isbn]
        var title
        try {
          title = data.title
        } catch (e) {
          title = 'Book'
        }
        UserBook.findOne({
          username: req.user.username,
          isbn: req.params.isbn
        }, function (err, associated) {
          aberprimo.get(req.params.isbn, function (primo) {
            res.render('book',{
              book: data,
              user: req.user,
              pretty: true,
              active: 'books',
              title: title,
              isbn: req.params.isbn,
              associated: associated,
              primo: primo,
              translate: aberprimo.translate
            })
          })
        })
      })
    }
  )

  app.get('/example',
    function (req, res) {
      console.log(req.ip + ' accessed example! *******')
      res.render('example')
    }
  )
}
