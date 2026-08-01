'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff_attendance', {
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

      staff_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },

      attendance_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      check_in: {
        type: Sequelize.DATE,
        allowNull: true
      },

      check_out: {
        type: Sequelize.DATE,
        allowNull: true
      },

      total_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Total working hours'
      },

      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Present, 2=Absent, 3=Half Day, 4=Leave, 5=Holiday'
      },

      is_late: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },

      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },

      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex(
      'staff_attendance',
      ['staff_id', 'attendance_date'],
      {
        unique: true,
        name: 'staff_attendance_unique'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_attendance');
  }
};