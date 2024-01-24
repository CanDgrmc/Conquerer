const ApiResponse = require("../common/ApiResponse");
const { ErrorCodes, AuthError } = require("../common/errors");

module.exports = class {
  constructor(opts) {
    this.postRepository = opts.postRepository;
    this.logger = opts.logger;
    this.logger.defaultMeta= {service:'post-service'}
  }

  async list(req,res) {
    const params = {};
    if (req.query.categoryId) {
      params.categoryId = req.query.categoryId;
    }
    
    if (req.query.userId) {
      params.userId = req.query.userId;
    }

    const data = await this.postRepository.getAll(params, req.query.page, req.query.limit);
    return res.json(new ApiResponse(data));
  }

  async myPosts(req,res) {
    const data = await this.postRepository.getAll({userId: req.user.id});
    return res.json(new ApiResponse(data));
  }

  async create(req,res) {
    const user = req.user;

    const data = await this.postRepository.create({userId: user.id, ...req.body});

    return res.json(new ApiResponse(data));
  }

  async delete(req,res) {
    const user = req.user;
    const post = await this.postRepository.getById(req.params.id);
    if (post.userId !== user.id) {
      return res.status(ErrorCodes.AUTH.UNAUTHORIZED).json(new AuthError(ErrorCodes.AUTH.UNAUTHORIZED));
    }

    const data = await this.postRepository.delete(req.params.id);

    return res.json(new ApiResponse(data));
  }

  async update(req,res) {
    const user = req.user;
    const post = await this.postRepository.getById(req.params.id);
    if (post.userId !== user.id) {
      return res.status(ErrorCodes.AUTH.UNAUTHORIZED).json(new AuthError(ErrorCodes.AUTH.UNAUTHORIZED));
    }

    const data = await this.postRepository.update(req.body,req.params.id);

    return res.json(new ApiResponse(data));
  }
}