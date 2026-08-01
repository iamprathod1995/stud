'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
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

      student_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      father_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      mother_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      admission_no: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },

      roll_no: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      class_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },

      section_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },

      contact_number: {
        type: Sequelize.STRING(20),
        allowNull: true
      },

      gender: {
        type: Sequelize.ENUM('M', 'F', 'O'),
        allowNull: true,
        comment: 'M=Male, F=Female, O=Other'
      },

      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      admission_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      profile_image: {
        type: Sequelize.STRING(500),
        allowNull: true
      },

      address: {
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
    await queryInterface.addIndex('students', ['school_id']);
    await queryInterface.addIndex('students', ['class_id']);
    await queryInterface.addIndex('students', ['section_id']);
    await queryInterface.addIndex('students', ['admission_no']);
    await queryInterface.addIndex('students', ['contact_number']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('students');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_students_gender;'
    ).catch(() => { });
  }
};