const config = require('../config')
const winston = require('winston')
require('winston-daily-rotate-file')

const tsFormat = () => (new Date()).toLocaleTimeString()
const logger = new (winston.Logger)({
  transports: [
    // Console Logger Settings
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info',
    }),
  ],
  exitOnError: false,
  colors: config.logger.customColors,
})

module.exports = logger
