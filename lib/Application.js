const express = require('express');
const bodyParser = require('body-parser');
const useragent = require('express-useragent').express();
const helmet = require('helmet').default;
const { Logger } = require('winston');
const { rateLimit } = require('express-rate-limit');
const { createContainer, asClass, asValue, Lifetime, listModules } = require('awilix');
const cors = require('cors');
const db = require('../db/models');
const { ApplicationError, ErrorCodes } = require('../common/errors');
const {authorize} = require('../middlewares/AuthMiddleware');
const {validate} = require('../middlewares/Validator');
module.exports = class Application {

  /**
   * 
   * @param {object} config 
   * @param {number} config.port
   * @param {number} config.rateLimit
   * @param {number} config.defaultPageLimit
   * @param {string | undefined} config.databaseUrl
   * @param {object | undefined} config.dbConfig
   * @param {Logger} config.logger
   * @param {function} config.isDebugModeOn
   */
  constructor(config) {
    this.config = config;
    this.app = express();
    this.app.disable("x-powered-by");

    this.app.use(bodyParser.json());
    this.app.use((req, res, next) => {
      res.on('finish', () => {
        this.config.logger.info({
          req: {
              method: req.method,
              url   : req.url,
              ip    : req.ip
          },
          res: {
              status_code: res.statusCode
          }
        })
      });
      next();
    });
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: this.config.rateLimit,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    });

    this.app.use(limiter);

    // see default security setting https://helmetjs.github.io
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
    }));

    this.app.use(cors());

    this.app.use(useragent)

    this.app.use((err, req, res, next) => {
        this.config.logger.error(err.message);
        res.status(500).json(new ApplicationError('internal-server-error').toJson());
    });

  }


  async build() {
    this.db = db({DATABASE_URL: this.config.databaseUrl, dbConfig: this.config.dbConfig});
    try {

      
      await this.db.sequelize?.authenticate();
      this.config.logger.info('Db connection established..');

    } catch(err) {
      this.config.logger.error(`Db connection error > ${err.message}`);
      throw new ApplicationError(err.message);

    }
    // create app container
    this.container = createContainer();
    this.container.register({db: asValue(this.db)});
    this.container.register({logger: asValue(this.config.logger)});
    this.container.register({defaultPageLimit: asValue(this.config.defaultPageLimit)});
    await this.container.loadModules(
      [
        './services/*.js',
        './db/repositories/*.js',
      ],
      {
        formatName: 'camelCase',
        resolverOptions: {
          lifetime: Lifetime.SINGLETON,
          register: asClass,
        },
      },
    )

    // build application
    await this._buildApp();

  }

  async _buildApp() {
    await this._buildRoutes();
    
    const server = this.app.listen(this.config.port, () => {
      this.config.logger.info(`App started on port: ${this.config.port}`);
    })
    
    process.on('SIGTERM', async (err) => {
      await this.db?.sequelize?.close();
      server.close((err) => {
        console.log('Http server closed.');
        process.exit(err ? 1 : 0);
      });
    });
    process.on('SIGINT', async (err) => {
      await this.db?.sequelize?.close();
      server.close((err) => {
        console.log('Http server closed.');
        process.exit(err ? 1 : 0);
      });
    });

  }

  async _buildRoutes() {
    await this._buildV1Routes();
  }


  async _buildV1Routes() {
    const apiv1 = '/api/v1';    
    const v1Routes = require(`../routes${apiv1}`);

    for (let api in v1Routes) {
      const router = express.Router()
      const apiRouter = router;
      for(let route of v1Routes[api]) {
        const callbacks = []
        const routeCallback = async (req,res) => {
          
          let service, method
          if (typeof route.handler === 'string') {
            [service, method] = route.handler.split('.');
          } else if(typeof route.handler === 'object') {
            service = route.handler.service;
            method = route.handler.method;
          }

          const requiredService = this.container?.resolve(service)
          try{
            return await requiredService[method](req,res);
          }catch(err) {
            res.status(500).json(new ApplicationError(this.config.isDebugModeOn() ? err.message : ErrorCodes.INTERNAL.message,ErrorCodes.INTERNAL.code).toJson())
          }
        }
        if (route.auth) {
          callbacks.push(authorize(this.container))
        }
        if (route.schema) {
          callbacks.push(validate(route.schema))

        }

        callbacks.push(routeCallback)
        apiRouter[route.method.toLowerCase()](route.endpoint, ...callbacks)
      }

      this.app.use(`${apiv1}/${api}`,router);
    }
  }

};