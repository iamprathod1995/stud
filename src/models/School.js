module.exports = (sequelize, DataTypes) => {
    const School = sequelize.define('School', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        school_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        owner_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },


        school_logo: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    },{
      tableName: 'schools',
      underscored: true
    });

    return School;
};