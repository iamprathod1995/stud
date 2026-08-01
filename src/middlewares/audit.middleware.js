const auditService =
require("../services/audit.service");

module.exports =
(moduleName, action) => {

  return async (
    req,
    res,
    next
  ) => {

    const originalJson =
      res.json;

    res.json = function (data) {

      if (
        req.user &&
        data.success
      ) {

        auditService.create({

          user_id:
            req.user.id,

          action,

          module_name:
            moduleName,

          method:
            req.method,

          endpoint:
            req.originalUrl,

          ip_address:
            req.ip,

          new_data:
            JSON.stringify(data)

        });

      }

      return originalJson.call(
        this,
        data
      );
    };

    next();

  };

};