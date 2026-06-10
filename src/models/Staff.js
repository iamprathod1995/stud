module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        school_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        staff_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        father_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },

        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        gender: {
            type: DataTypes.ENUM('M', 'F', 'O'),
            allowNull: true,
            comment: 'M=Male, F=Female, O=Other'
        },

        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        role: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            comment: '1=teacher, 2=admin, 3=clerk, 4=peon, 5=other'
        },

        qualification: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        experience: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Experience in years'
        },

        joining_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        salary: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

        profile_image: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'staff',
        underscored: true
    });

    return Staff;
};