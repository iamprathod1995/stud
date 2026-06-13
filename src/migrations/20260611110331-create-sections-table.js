'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sections', {
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

      class_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },

      section_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
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

    await queryInterface.addIndex('sections', ['school_id']);
    await queryInterface.addIndex('sections', ['class_id']);

    await queryInterface.addConstraint('sections', {
      fields: ['class_id', 'section_name'],
      type: 'unique',
      name: 'unique_class_section'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sections');
  }
};