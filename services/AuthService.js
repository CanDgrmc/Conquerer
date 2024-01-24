const bcrypt = require('bcryptjs');
const { AuthError, ErrorCodes } = require('../common/errors');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const ApiResponse = require('../common/ApiResponse');
const HOUR = 60*60
module.exports = class AuthService {
  constructor(opts) {
    this.userRepository = opts.userRepository;
    this.userTokenRepository = opts.userTokenRepository;
    this.logger = opts.logger;
    this.logger.defaultMeta= {service:'auth-service'}
    
  }

  async login(req,res) {
    const {email, password} = req.body;
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return res.status(ErrorCodes.AUTH.CREDENTIALS_ERROR.code).json(new AuthError(ErrorCodes.AUTH.CREDENTIALS_ERROR.message,ErrorCodes.AUTH.CREDENTIALS_ERROR.code).toJson());

    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(ErrorCodes.AUTH.CREDENTIALS_ERROR.code).json(new AuthError(ErrorCodes.AUTH.CREDENTIALS_ERROR.message,ErrorCodes.AUTH.CREDENTIALS_ERROR.code).toJson());
    } else {
      await this.userTokenRepository.disableAllUserTokens(user.id);
      delete user.dataValues.password
      
      const token = jwt.sign({
        user,
      }, process.env.JWT_SECRET || 'supersecret', {expiresIn: process.env.SESSION_TIMEOUT_HOUR ? parseInt(process.env.SESSION_TIMEOUT_HOUR) * HOUR : HOUR});
      await this.userTokenRepository.create({
        userId: user.id,
        token: token,
        userAgent: `${req.useragent.browser}|${req.useragent.version}|${req.useragent.os}|${req.useragent.platform}|${req.useragent.source}`,
        isActive: 1
      })
      return res.json(new ApiResponse({
        token,
      }))
    }
  }

  async verifyToken(req, res) {
    try {
      const {token} = req.body;
      const verified = jwt.verify(token,process.env.JWT_SECRET || 'supersecret');
      return res.json(new ApiResponse({verified}));
    } catch (err) {
      return res.status(ErrorCodes.AUTH.INVALID_TOKEN_ERROR.code).json(new AuthError(err.message).toJson())
    }
    
  }

  async register(req, res) {
    try {
      const {email, password, username, fullname} = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const [user,created] = await this.userRepository.register({email, passwordHash, username, fullname});
      if (!created) {
        this.logger.error(`username > ${username} or email > ${email} already registered`);
        return res.json(new AuthError(ErrorCodes.AUTH.EXISTS_ERROR.message, ErrorCodes.AUTH.EXISTS_ERROR.code).toJson());
      }
      const token = jwt.sign({
        user,
      }, process.env.JWT_SECRET || 'supersecret', {expiresIn: process.env.SESSION_TIMEOUT_HOUR ? parseInt(process.env.SESSION_TIMEOUT_HOUR) * HOUR : HOUR});
      await this.userTokenRepository.create({
        userId: user.id,
        token: token,
        userAgent: `${req.useragent.browser}|${req.useragent.version}|${req.useragent.os}|${req.useragent.platform}|${req.useragent.source}`,
        isActive: 1
      })
      return res.json(new ApiResponse({
        token,
      }))
    } catch (err) {
      this.logger.error(err.message);
      return res.json(new AuthError(ErrorCodes.AUTH.UNKNOWN_ERROR.message, ErrorCodes.AUTH.UNKNOWN_ERROR.code).toJson());
    }
    
  }
}