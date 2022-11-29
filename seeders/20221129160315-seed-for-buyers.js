"use strict";

const { hashPass } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const { buyers } = require("../db.json");
    buyers.forEach((el) => {
      delete el.id;
      el.password = hashPass(el.password);
      el.website = "www.pornhub.com";
      el.createdAt = el.updatedAt = new Date();
    });
    // console.log(buyers[0])
    await queryInterface.bulkInsert("Buyers", buyers, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Buyers", null, {});
  },
};
