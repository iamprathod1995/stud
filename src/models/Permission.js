module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      role_id: DataTypes.BIGINT.UNSIGNED,
      module_id: DataTypes.BIGINT.UNSIGNED,

      can_add: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      can_view: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      can_update: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      can_delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'permissions',
      underscored: true
    }
  );

  Permission.associate = (models) => {

    Permission.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });

    Permission.belongsTo(models.Module, {
      foreignKey: 'module_id',
      as: 'module'
    });

  };

  return Permission;
};