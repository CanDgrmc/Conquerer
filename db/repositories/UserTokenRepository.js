const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {v4:uidv4} = require('uuid');

module.exports = class {
  constructor(opts) {
    this.userTokenModel = opts.db.UserToken;
  }

  /**
   * 
   * @param {string} userId 
   * @returns 
   */
  async getTokensByUserId(userId) {
    const user = await this.userTokenModel.findAll({where:{userId}});
    return user;
  }


  /**
   * 
   * @param {string} userId 
   * @returns 
   */
  async getActiveUserToken(userId, token) {
    const user = await this.userTokenModel.findOne({where:{userId, token, isActive: true}});
    return user;
  }



  /**
   * 
   * @param {string} userId 
   */
  async disableAllUserTokens(userId) {
    await this.userTokenModel.update({isActive:0}, {where:{userId}});
  }


  /**
   * 
   * @param {object} body 
   * @returns 
   */
  async create(body) {
    return await this.userTokenModel.create(body);
  }
}