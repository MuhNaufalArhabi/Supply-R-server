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
   const data = require('../db.json').orders.map(el => {
    el.createdAt = el.updatedAt = new Date()
    return el
   });
   await queryInterface.bulkInsert('Orders', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders')
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
