module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      user_id: DataTypes.BIGINT.UNSIGNED,

      token: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'refresh_tokens',
      underscored: true
    }
  );

  RefreshToken.associate = (models) => {

    RefreshToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

  };

  return RefreshToken;
};