var express = require('express')
var app = express()
var config = require('./config')
var log = require('./logger')

app.use(express.static(__dirname + '/public'))
app.use(express.bodyParser())
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.listen(config.get('port'))
log.info('Listening on port %s', config.get('port'))

require('./routes/login')(app)
require('./routes/home')(app)

// 404 default
require('./routes/error')(app)

var auth = require('./auth')
var db = require('./db')

module.exports = app

process.on('uncaughtException', function (err) {
  // TODO: do this properly
  log.error(err.stack)
  process.exit(1)
})
