module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      last_login: {
        type: DataTypes.DATE
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'users',
      underscored: true
    }
  );

  User.associate = (models) => {

    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });

    User.hasMany(models.RefreshToken, {
      foreignKey: 'user_id',
      as: 'tokens'
    });

  };

  return User;
};