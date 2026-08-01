'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('users', {

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
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(150),
        unique: true,
        allowNull: false
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      last_login: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('users');
  }
};