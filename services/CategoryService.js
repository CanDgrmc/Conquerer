const ApiResponse = require("../common/ApiResponse");

module.exports = class {
  constructor(opts) {
    this.categoryRepository = opts.categoryRepository;
    this.logger = opts.logger;
    this.logger.defaultMeta= {service:'category-service'}
  }

  async list(req,res) {
    const data = await this.categoryRepository.getAllPostCategories();
    return res.json(new ApiResponse(data));
  }

}