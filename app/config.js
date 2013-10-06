/*
 * config.js
 *
 * Initialises the configuration. Check https://github.com/lloyd/node-convict
 * for the schema of the `conf` variable.
 *
 * Configurations can be edited on a per-install basis by creating a
 * `config.json` file in the root directory: do not edit the configurations
 * here unless you are intending to edit them for everyone.
 *
 */

var convict = require('convict')
var log = require('./logger')

var conf = convict({
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  database: {
    doc: 'The URI of the MongoDB database.',
    format: 'url',
    default: 'mongodb://localhost/library',
    env: 'DB'
  },
  secret: {
    doc: 'The preferably random and unique string used to encrypt and salt.',
    default: 'abcdef',
    env: 'SECRET'
  }
})

try {
  conf.loadFile('../config.json');
  log.info('Using configuration from config.json')
} catch(e) {
  log.info('Using default configuration settings.')
  log.info('Create config.json to change from the defaults')
}

module.exports = conf
