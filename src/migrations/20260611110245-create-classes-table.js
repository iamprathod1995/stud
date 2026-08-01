'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      school_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },

      class_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      class_code: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Active, 0=Inactive'
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

    // Indexes
    await queryInterface.addIndex('classes', ['school_id']);
    await queryInterface.addIndex('classes', ['class_name']);
    
    // Same school me duplicate class na ho
    await queryInterface.addConstraint('classes', {
      fields: ['school_id', 'class_name'],
      type: 'unique',
      name: 'unique_school_class_name'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classes');
  }
};