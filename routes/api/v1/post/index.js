module.exports = [
  {
    endpoint: '/',
    method: 'get',
    auth: true,
    handler: 'postService.list'
  },
  {
    endpoint: '/mine',
    method: 'get',
    auth: true,
    handler: 'postService.myPosts'
  },
  {
    endpoint: '/create',
    method: 'post',
    auth: true,
    schema: {
      body: {
        title: {
          required:true,
          type: 'string',
        },
        content: {
          required: true,
          type: 'string',
        },
        categoryId: {
          required: true,
          type: 'number',
        }
      },
    },
    handler: {
      service: 'postService',
      method: 'create'
    }
  },
  {
    endpoint: '/update/:id',
    method: 'put',
    auth: true,
    schema: {
      params: {
        id: {
          required:true,
          type: 'string',
        },
      },
    },
    handler: {
      service: 'postService',
      method: 'update'
    }
  },
  {
    endpoint: '/delete/:id',
    params: {
      id: {
        required:true,
        type: 'string',
      },
    },
    method: 'delete',
    auth: true,
    handler: 'postService.delete'
  },
]