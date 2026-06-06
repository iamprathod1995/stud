'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('permissions', {

      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      role_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },

      module_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id'
        }
      },

      can_add: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      can_view: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      can_update: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      can_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('permissions');
  }
};