module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define('Class', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        school_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        class_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        class_code: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        description: {
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
        tableName: 'classes',
        underscored: true
    });

    Class.associate = (models) => {
        Class.hasMany(models.Student, {
            foreignKey: 'class_id',
            as: 'students'
        });

        Class.hasMany(models.Section, {
            foreignKey: 'class_id',
            as: 'sections'
        });
    };

    return Class;
};