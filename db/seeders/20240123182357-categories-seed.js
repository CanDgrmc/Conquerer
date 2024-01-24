'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('Categories', [
        {
          id: 1,
          name: 'Artificial Intelligence',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id:2,
          name: 'Business',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id:3,
          name: 'Money',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id:4,
          name: 'Technology',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('Delete from "Categories" where id in (1,2,3,4)')
  }
};
