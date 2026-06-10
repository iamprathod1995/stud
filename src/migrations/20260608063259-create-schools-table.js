'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schools', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },

      school_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      owner_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      school_logo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },

      contact_number: {
        type: Sequelize.STRING(20),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('schools');
  }
};