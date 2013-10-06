/*
 * index.js
 *
 * This is the main file for the application. Try to move as much as you can to
 * a different file, and require() it in.
 *
 */

var express = require('express')
var app = module.exports = express()
var config = require('./config')
var log = require('./logger')
var passport = require('./auth')

app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(express.logger('dev'))
app.use(express.cookieParser())
app.use(express.bodyParser())
app.use(express.session({secret: config.get('secret')}))
app.use(passport.initialize())
app.use(passport.session())
app.use(app.router)


app.listen(config.get('port'))
log.info('Listening on port %s', config.get('port'))

require('./routes/login')(app)
require('./routes/home')(app)
require('./routes/addbook')(app)
require('./routes/profile')(app)
require('./routes/version')(app)

// 404 default
require('./routes/error')(app)

var auth = require('./auth')
var db = require('./db')

process.on('uncaughtException', function (err) {
  // TODO: do this properly
  log.error(err.stack)
  process.exit(1)
})
