const {v4:uidv4} = require('uuid');

module.exports = class {
  constructor(opts) {
    this.commentModel = opts.db.Comment;
    this.defaultPageLimit = opts.defaultPageLimit;
  }

  async getAll(params, page = 1, limit = this.defaultPageLimit) {
    return await this.commentModel.findAll({where:params, limit, offset: limit * (page-1), order:[['createdAt', 'DESC']], include: {
      model:this.commentModel,
      as: 'comments',
      limit: this.defaultPageLimit
    }});
  }

  async getById(id) {
    return await this.commentModel.findByPk(id);
  }

  async create(data) {
    data.id = uidv4();
    return await this.commentModel.create(data);
  }

  async delete(commentId) {
    return await this.commentModel.destroy({where: {id:commentId}});
  }

  async update(data, id) {
    return await this.commentModel.update(data, {where: {id}});
  }
}