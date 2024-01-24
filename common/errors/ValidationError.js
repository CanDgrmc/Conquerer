const ErrorCode = require('./ErrorCodes');
class AuthError extends Error {
  constructor(errors) {
    super();
    this.message = ErrorCode.VALIDATION.INVALID_REQUEST.message;
    this.code = ErrorCode.VALIDATION.INVALID_REQUEST.code;
    this.errors = errors;
  }

  toJson() {
    const obj = {
      message: this.message,
      code: this.code,
      status: 'ERROR',
      errors: this.errors
    }
    if (process.env.DEBUG && ['1', 'true', 'True'].includes(process.env.DEBUG)) {
      obj.errors = this.errors;
    }

    return obj;
  }
}

module.exports = AuthError;