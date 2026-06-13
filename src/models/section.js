module.exports = (sequelize, DataTypes) => {
    const Section = sequelize.define('Section', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        school_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        class_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        section_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            comment: '1=Active, 0=Inactive'
        }
    }, {
        tableName: 'sections',
        underscored: true
    });

    Section.associate = (models) => {
        Section.belongsTo(models.Class, {
            foreignKey: 'class_id',
            as: 'class'
        });

        Section.hasMany(models.Student, {
            foreignKey: 'section_id',
            as: 'students'
        });
    };

    return Section;
};