'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('audit_logs', {

      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },

      action: {
        type: Sequelize.STRING(100)
      },

      module_name: {
        type: Sequelize.STRING(150)
      },

      old_data: {
        type: Sequelize.JSON
      },

      new_data: {
        type: Sequelize.JSON
      },

      ip_address: {
        type: Sequelize.STRING(100)
      },

      user_agent: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('audit_logs');
  }
};