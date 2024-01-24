require('dotenv').config()
const Application = require('./lib/Application');
const logger = require('./common/Logger');
const { ApplicationError } = require('./common/errors');
const dbConfig = require('./db/config/config.json');

const run = async () => {
  if (!process.env.DATABASE_URL && !dbConfig) {
    throw new ApplicationError('Database configurations not defined');
  }
  const app = new Application({
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    logger,
    rateLimit: process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 100,
    databaseUrl: process.env.DATABASE_URL,
    dbConfig: dbConfig[process.env.NODE_ENV || 'development'],
    defaultPageLimit: 50,
    isDebugModeOn: isDebugModeOn,
  });
  
  await app.build();
}

const isDebugModeOn = () => process.env.DEBUG && ['1', 'true', 'True'].includes(process.env.DEBUG)

run().then(() => logger.info('Application is built')).catch((err) => {
  if (isDebugModeOn()) { process
    logger.error(err.message);
  }
  
  process.exit(0)
});

