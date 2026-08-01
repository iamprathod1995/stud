'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('refresh_tokens', {

      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },

      token: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable('refresh_tokens');
  }
};