module.exports = {
  INTERNAL: {
    message: 'Internal error',
    code: 5000,
  },
  AUTH: {
    UNAUTHORIZED: {
      code: 401,
      message: 'Unauthorized',
    },
    TOKEN_DEACTIVATED: {
      code: 401,
      message: 'Token deactivated',
    },
    UNKNOWN_ERROR: {
      code: 500,
      message: 'Something went wrong.',
    },
    EXISTS_ERROR: {
      code: 500,
      message: 'User already exists',
    },
    CREDENTIALS_ERROR: {
      code: 500,
      message: 'Wrong credentials',
    },
    INVALID_TOKEN_ERROR: {
      code: 500,
      message: 'Invalid token',
    }
  },
  VALIDATION: {
    INVALID_REQUEST: {
      code: 500,
      message: 'Invalid request',
    }
  }
}