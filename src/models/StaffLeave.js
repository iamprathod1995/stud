module.exports = (sequelize, DataTypes) => {
    const StaffLeave = sequelize.define('StaffLeave', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        school_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        staff_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        leave_type: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            comment: '1=Casual, 2=Sick, 3=Emergency, 4=Paid, 5=Other'
        },

        from_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        to_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        total_days: {
            type: DataTypes.DECIMAL(5, 1),
            allowNull: false,
            defaultValue: 1
        },

        reason: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
            comment: '0=Pending, 1=Approved, 2=Rejected'
        },

        approved_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },

        approved_at: {
            type: DataTypes.DATE,
            allowNull: true
        },

        admin_remark: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'staff_leaves',
        underscored: true
    });

    StaffLeave.associate = (models) => {
        // Leave Apply Karne Wala Staff
        StaffLeave.belongsTo(models.Staff, {
            foreignKey: 'staff_id',
            as: 'staff'
        });

        // Approve/Reject Karne Wala Admin
        StaffLeave.belongsTo(models.Staff, {
            foreignKey: 'approved_by',
            as: 'approver'
        });
    };

    return StaffLeave;
};