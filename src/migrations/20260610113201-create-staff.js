'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      school_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },

      staff_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      father_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(191),
        allowNull: true,
        unique: true
      },

      contact_number: {
        type: Sequelize.STRING(20),
        allowNull: false
      },

      gender: {
        type: Sequelize.STRING(1),
        allowNull: true,
        comment: "M=Male, F=Female, O=Other"
      },

      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      role: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=teacher, 2=admin, 3=clerk, 4=peon, 5=other'
      },

      qualification: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      experience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      joining_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('staff');
  }
};