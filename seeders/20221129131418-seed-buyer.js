'use strict';
const {hashPass} = require('../helpers/bcrypt');

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
   const data = require('../db.json').buyers.map(el => {
    delete el.id
    el.createdAt = el.updatedAt = new Date()
    el.password = hashPass(el.password)
    return el
   });
   await queryInterface.bulkInsert('Buyers', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Buyers')
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
