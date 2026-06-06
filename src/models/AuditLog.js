module.exports =
(sequelize, DataTypes) => {

  const AuditLog =
    sequelize.define(

      "AuditLog",

      {

        user_id:
        DataTypes.INTEGER,

        action:
        DataTypes.STRING,

        module_name:
        DataTypes.STRING,

        method:
        DataTypes.STRING,

        endpoint:
        DataTypes.STRING,

        ip_address:
        DataTypes.STRING,

        old_data:
        DataTypes.TEXT,

        new_data:
        DataTypes.TEXT

      },

      {
        tableName:
          "audit_logs"
      }

    );

  return AuditLog;
};