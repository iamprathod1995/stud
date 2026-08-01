'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('modules', {

      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      parent_module_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('modules');
  }
};