module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'roles',
      underscored: true
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'role_id',
      as: 'users'
    });

    Role.hasMany(models.Permission, {
      foreignKey: 'role_id',
      as: 'permissions'
    });
  };

  return Role;
};