module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define(
    'Module',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },

      parent_module_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'modules',
      underscored: true
    }
  );

  Module.associate = (models) => {

    Module.hasMany(models.Permission, {
      foreignKey: 'module_id',
      as: 'permissions'
    });

    Module.belongsTo(models.Module, {
      foreignKey: 'parent_module_id',
      as: 'parent'
    });

  };

  return Module;
};