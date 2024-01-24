module.exports = class {
  constructor(opts) {
    this.categoryModel = opts.db.Category;
  }

  async getAllPostCategories() {
    return await this.categoryModel.findAll({
      attributes: ['id','name']
    });
  }

}