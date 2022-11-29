'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chat: {
        type: Sequelize.STRING
      },
      ShopId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Shops',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      BuyerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Buyers',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  }
};