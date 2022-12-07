'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const data = require('../db.json').products.map(el => {
    el.createdAt = el.updatedAt = new Date()
    el.slug = el.name.toLowerCase().split(' ').join('-')
    return el
   });
   await queryInterface.bulkInsert('Products', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products')
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
