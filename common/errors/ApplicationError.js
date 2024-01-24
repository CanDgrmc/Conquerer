const ErrorCode = require('./ErrorCodes');
class ApplicationError extends Error {
  constructor(message, code) {
    super(message);
    this.message = message;
    this.code = code || ErrorCode.INTERNAL.code;
  }

  toJson() {
    const obj = {
      message: this.message,
      code: this.code,
      status: 'ERROR',
    }
    if (process.env.DEBUG && ['1', 'true', 'True'].includes(process.env.DEBUG)) {
      obj.stack = this.stack?.split('\n').filter(i => i.trim())
    }

    return obj;
  }
}

ApplicationError.prototype.name = 'ApplicationError';
module.exports = ApplicationError;