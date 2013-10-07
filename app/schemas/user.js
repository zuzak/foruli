var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  loginCount: Number,
  showUpstream: Boolean
})

var user = mongoose.model('User', userSchema)

module.exports = user
