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
   const data = require('../db.json').categories.map(el => {
    delete el.id
    el.createdAt = el.updatedAt = new Date()
    return el
   });
   await queryInterface.bulkInsert('Categories', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories')
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
