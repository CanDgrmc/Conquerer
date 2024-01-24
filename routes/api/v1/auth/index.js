module.exports = [
  {
    endpoint: '/login',
    method: 'post',
    auth: false,
    schema: {
      body: {
        email: {
          required:true,
          type: 'string',
        },
        password: {
          required: true,
          type: 'string',
        }
      },
    },
    handler: {
      service: 'authService',
      method: 'login'
    }
  },
  {
    endpoint: '/register',
    method: 'post',
    auth: false,
    schema: {
      body: {
        email: {
          required:true,
          type: 'string',
        },
        password: {
          required: true,
          type: 'string',
        },
        username: {
          required: true,
          type: 'string',
        },
        fullname: {
          required: false,
          type: 'string',
        }
      },
    },
    handler: {
      service: 'authService',
      method: 'register'
    }
  },
  {
    endpoint: '/verify-token',
    method: 'post',
    auth: false,
    schema: {
      body: {
        token: {
          required:true,
          type: 'string',
        },
      },
    },
    handler: {
      service: 'authService',
      method: 'verifyToken'
    }
  }
]