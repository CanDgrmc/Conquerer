const { Sequelize, Op } = require('sequelize');
const {v4:uidv4} = require('uuid');

module.exports = class {
  constructor(opts) {
    this.postModel = opts.db.Post;
    this.commentModel = opts.db.Comment;
    this.userModel = opts.db.User;
    this.defaultPageLimit = opts.defaultPageLimit;
  }

  async getAll(params, page = 1, limit = this.defaultPageLimit) {
    return await this.postModel.findAll({
      where:params,
      limit,
      offset: limit * (page-1),
      order:[['createdAt', 'DESC']],
      include: [
        {
          model: this.commentModel,
          as: 'comments',
          limit: this.defaultPageLimit,
          order:[['createdAt', 'DESC']],
          include: {model: this.commentModel, as: 'comments', limit: this.defaultPageLimit}
        },
        {
          
          model: this.userModel,
          as: 'author',
          attributes: [
              'id',
              'username',
              'email',
              'fullname',
              [ Sequelize.cast(Sequelize.literal('(select count(*) from "Posts" where "Posts"."userId"=author.id )'), 'integer'), 'postCounts' ]
          ],
      }
    ],
  });
  }

  
  async getById(id) {
    return await this.postModel.findByPk(id);
  }

  async create(data) {
    data.id = uidv4();
    return await this.postModel.create(data);
  }

  async delete(postId) {
    return await this.postModel.destroy({where: {id:postId}});
  }

  async update(data, id) {
    return await this.postModel.update(data, {where: {id}});
  }
}

