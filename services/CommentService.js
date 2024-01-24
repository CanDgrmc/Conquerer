const ApiResponse = require("../common/ApiResponse");
const { ErrorCodes, AuthError, ApplicationError } = require("../common/errors");

module.exports = class {
  constructor(opts) {
    this.commentRepository = opts.commentRepository;
    this.logger = opts.logger;
    this.logger.defaultMeta= {service:'comment-service'}
  }

  async getPostComments(req,res) {
    const params = {
      postId: req.params.id,
    };

    const data = await this.commentRepository.getAll(params, req.query.page, req.query.limit);
    return res.json(new ApiResponse(data));
  }

  async myComments(req,res) {
    const data = await this.commentRepository.getAll({userId: req.user.id},req.query.page, req.query.limit);
    return res.json(new ApiResponse(data));
  }

  async create(req,res) {
    const user = req.user;
    const params = {
      userId: user.id,
      content: req.body.content
    }
    switch(req.body.contentType) {
      case 'Post':
        params.postId = req.body.contentId
        break;
      case 'Comment':
        params.commentId = req.body.contentId
        break;
    }

    const data = await this.commentRepository.create(params);

    return res.json(new ApiResponse(data));
  }

  async delete(req,res) {
    const user = req.user;
    const comment = await this.commentRepository.getById(req.params.id);
    if (comment.userId !== user.id) {
      return res.status(ErrorCodes.AUTH.UNAUTHORIZED).json(new AuthError(ErrorCodes.AUTH.UNAUTHORIZED));
    }

    const data = await this.commentRepository.delete(req.params.id);

    return res.json(new ApiResponse(data));
  }

  async update(req,res) {
    const user = req.user;
    const comment = await this.commentRepository.getById(req.params.id);
    if (!comment) {
      return res.status(500).json(new ApplicationError('comment not found').toJson())
    }
    if (comment.userId !== user.id) {
      return res.status(ErrorCodes.AUTH.UNAUTHORIZED).json(new AuthError(ErrorCodes.AUTH.UNAUTHORIZED).toJson());
    }

    const data = await this.commentRepository.update(req.body,req.params.id);

    return res.json(new ApiResponse(data));
  }
}