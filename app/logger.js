var winston = require('winston')

var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    })
  ],
  levels: {
    info: 1,
    warn: 2,
    error: 3
  },
  colors: {
    info: 'green',
    warn: 'yellow',
    error: 'red'
  }
})

module.exports = log
