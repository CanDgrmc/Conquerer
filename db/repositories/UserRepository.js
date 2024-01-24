const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {v4:uidv4} = require('uuid');

module.exports = class {
  constructor(ctx) {
    this.ctx = ctx;
    this.userModel = this.ctx.db.User;

  }

  /**
   * 
   * @param {string} email 
   * @returns 
   */
  async getByEmail(email) {
    const user = await this.userModel.findOne({where:{email}});
    return user;
  }

  /**
   * 
   * @param {string} id 
   * @returns 
   */
  async getById(id) {
    const user = await this.userModel.findByPk(id);
    return user;
  }

  /**
   * 
   * @param {object} body 
   * @param {string} body.username
   * @param {string} body.email
   * @param {string} body.passwordHash
   * @param {string} body.fullname
   * @returns 
   */
  async register({username,email,passwordHash,fullname}) {
    
    return await this.userModel.findOrCreate({
      where: {
        [Op.or]: [
          {username},
          {email}
        ]
      },
      defaults:{
        id: uidv4(),
        username,
        fullname,
        email,
        password:passwordHash
      }
    });
  }
}