var mongoose = require('mongoose')

var userbookSchema = new mongoose.Schema({
  username: String,
  isbn: String
})

var book = mongoose.model('UserBook', userbookSchema)

module.exports = book
