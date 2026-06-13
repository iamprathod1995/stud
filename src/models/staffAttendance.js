module.exports = (sequelize, DataTypes) => {
    const StaffAttendance = sequelize.define('StaffAttendance', {
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

        attendance_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        check_in: {
            type: DataTypes.DATE,
            allowNull: true
        },

        check_out: {
            type: DataTypes.DATE,
            allowNull: true
        },

        total_hours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Total working hours'
        },

        status: {
            type: DataTypes.ENUM(
                'present',
                'absent',
                'half_day',
                'leave'
            ),
            allowNull: false,
            defaultValue: 'present'
        },

        is_late: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },

        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },

        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'staff_attendance',
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['staff_id', 'attendance_date']
            }
        ]
    });

    StaffAttendance.associate = (models) => {
        StaffAttendance.belongsTo(models.Staff, {
            foreignKey: 'staff_id',
            as: 'staff'
        });
    };

    return StaffAttendance;
};