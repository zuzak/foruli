var fs = require('fs')
var log = require('../logger')

//  http://stackoverflow.com/a/11923719/1875784

module.exports = function (app) {
  fs.readdirSync(__dirname).forEach(function (file) {
    if (file == 'index.js') {
      return
    }
    var name = file.substr(0, file.indexOf('.'))
    log.info('Initialising ' + name + ' route.')
    require('./' + name)(app)
  })
}
