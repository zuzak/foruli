var mongoose = require('mongoose')
var log = require('./logger')
var config = require('./config')

mongoose.connect(config.get('database'))

var db = mongoose.connection

db.on('error', function () {
  log.error('Database connection error.')
})

db.on('open', function () {
  log.info('Database connection opened.')
})

module.exports = db
