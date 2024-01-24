module.exports = [
  {
    endpoint: '/mine',
    method: 'get',
    auth: true,
    handler: 'commentService.myComments'
  },
  {
    endpoint: '/post/:id',
    method: 'get',
    auth: true,
    handler: 'commentService.getPostComments'
  },
  {
    endpoint: '/create',
    method: 'post',
    auth: true,
    schema: {
      body: {
        contentId: {
          required:true,
          type: 'string',
        },
        contentType: {
          required:true,
          type: 'enum',
          options: ['Post','Comment']
        },
        content: {
          required: true,
          type: 'string',
        }
      },
    },
    handler: {
      service: 'commentService',
      method: 'create'
    }
  },
  {
    endpoint: '/update/:id',
    method: 'put',
    auth: true,
    schema: {
      body: {
        content: {
          required: true,
          type: 'string',
        }
      },
    },
    handler: {
      service: 'commentService',
      method: 'update'
    }
  },
  {
    endpoint: '/delete/:id',
    method: 'delete',
    auth: true,
    handler: 'commentService.delete'
  },
]