module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        school_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        student_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        father_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        mother_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        admission_no: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        roll_no: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        class_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },

        section_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },

            email: {
                type: DataTypes.STRING(255),
                allowNull: true,
                unique: true
            },

        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: true
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

        admission_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
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
            defaultValue: 1,
            comment: '1=Active, 0=Inactive'
        }
    }, {
        tableName: 'students',
        underscored: true
    });

    return Student;
};