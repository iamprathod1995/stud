const {
  Permission
} = require("../models");

module.exports =
(moduleName, action) => {

  return async (
    req,
    res,
    next
  ) => {

    try {

      const roleId =
        req.user.role_id;

      const permission =
        await Permission.findOne({

          include: [
            {
              association:
                "module",
              where: {
                name:
                moduleName
              }
            }
          ],

          where: {
            role_id: roleId
          }

        });

      if (!permission) {

        return res.status(403)
        .json({

          success: false,
          message:
            "Permission denied"

        });

      }

      const map = {

        add:
          permission.can_add,

        view:
          permission.can_view,

        update:
          permission.can_update,

        delete:
          permission.can_delete

      };

      if (!map[action]) {

        return res.status(403)
        .json({

          success: false,
          message:
            "Access denied"

        });

      }

      next();

    } catch (error) {

      next(error);

    }

  };

};