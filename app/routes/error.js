var log = require('../logger')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.status(404)
    res.render('message', {type: 'danger', header: '404 Not Found', msg: 'Couldn\'t find ' + req.url})
    log.warn("404 on %s", req.url)
  })
}
