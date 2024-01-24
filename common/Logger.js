const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  // defaultMeta: {service: 'application'},
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error', dirname: 'logs' }),
    new winston.transports.File({ filename: 'combined.log', dirname: 'logs' }),
    new winston.transports.Console()
  ],
});

module.exports = logger;