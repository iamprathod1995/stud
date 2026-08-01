'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff_leaves', {
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

      staff_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        comment: 'Teacher/Staff who applied leave'
      },

      leave_type: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Casual, 2=Sick, 3=Emergency, 4=Paid, 5=Other'
      },

      from_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      to_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      total_days: {
        type: Sequelize.DECIMAL(5, 1),
        allowNull: false,
        defaultValue: 1
      },

      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '0=Pending, 1=Approved, 2=Rejected'
      },

      approved_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        comment: 'Admin Staff ID'
      },

      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      admin_remark: {
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

    // Foreign Keys

    await queryInterface.addConstraint('staff_leaves', {
      fields: ['school_id'],
      type: 'foreign key',
      name: 'fk_staff_leaves_school',
      references: {
        table: 'schools',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('staff_leaves', {
      fields: ['staff_id'],
      type: 'foreign key',
      name: 'fk_staff_leaves_staff',
      references: {
        table: 'staff',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('staff_leaves', {
      fields: ['approved_by'],
      type: 'foreign key',
      name: 'fk_staff_leaves_approved_by',
      references: {
        table: 'staff',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('staff_leaves');
  }
};