var ensureLogin = require('connect-ensure-login').ensureLoggedIn
var oL = 'http://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:'
var request = require('request')

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
        var data = JSON.parse(b)
        data = data['ISBN:' + req.params.isbn]
        res.render('book',{
          book: data,
          user: req.user,
          pretty: true,
          active: 'books',
          title: data.title
        })
      })
    }
  )
}
