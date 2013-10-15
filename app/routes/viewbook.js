var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var request = require('request')
var UserBook = require('../schemas/userbook')
var classify2 = require('classify2').get

const oL = 'http://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:'

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
        classify2(req.params.isbn, function (calls) {
          if (!data.classifications) {
            data.classifications = []
          }
          if (calls.congress) {
            if (!data.classifications.lc_classifications){
              data.classifications.lc_classifications = []
            }
            data.classifications.lc_classifications.push(calls.congress)
          }
          if (calls.dewey) {
            if (!data.classifications.dewey_decimal_class) {
              data.classifications.dewey_decimal_class = []
            }
            data.classifications.dewey_decimal_class.push(calls.dewey)
          }
          UserBook.findOne({
            username: req.user.username,
            isbn: req.params.isbn
          }, function (err, associated) {
            res.render('book',{
              book: data,
              user: req.user,
              pretty: true,
              active: 'books',
              title: title,
              isbn: req.params.isbn,
              associated: associated
            })
          })
        })
      })
    }
  )

}
