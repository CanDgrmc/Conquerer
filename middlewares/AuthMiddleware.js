const jwt = require('jsonwebtoken');
const { ApplicationError, ErrorCodes } = require('../common/errors');
exports.authorize = (ctx) => (req, res, next) => {
  const userTokenRepository = ctx.resolve('userTokenRepository');
  const logger = ctx.resolve('logger');
  const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'superseret';
  if (!ACCESS_TOKEN_SECRET) {
    return res.json(new ApplicationError(`ACCESS_TOKEN_SECRET is not defined`, ErrorCodes.INTERNAL.code).toJson())
  }

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(ErrorCodes.AUTH.UNAUTHORIZED.code).send({ message: ErrorCodes.AUTH.UNAUTHORIZED.message});
  }
  
  const split = authorization.split('Bearer ');
  if (split.length !== 2) {
    return res.status(ErrorCodes.AUTH.UNAUTHORIZED.code).send({ message: ErrorCodes.AUTH.UNAUTHORIZED.message});
  }
  const token = split[1];

  try {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = data.user;

      userTokenRepository.getActiveUserToken(req.user.id, token).then((token) => {
        if(!token) {
          return res.status(ErrorCodes.AUTH.TOKEN_DEACTIVATED.code).send({ message: ErrorCodes.AUTH.TOKEN_DEACTIVATED.message});
        } else {
          next();
        }
      }).catch(err => {
        logger.error(err.message);
        return res.status(ErrorCodes.AUTH.UNAUTHORIZED.code).send({ message: ErrorCodes.AUTH.UNAUTHORIZED.message});
      })
    })
  }
  catch (err) {
    logger.error(err.message);
    return res.status(ErrorCodes.AUTH.UNAUTHORIZED.code).send({ message: ErrorCodes.AUTH.UNAUTHORIZED.message});
  }
}