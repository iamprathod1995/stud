const permissionService = require("../services/permission.service");

exports.assign =
async (req, res, next) => {

  try {

    const data =
      await permissionService.assign(
        req.body
      );

    res.status(201).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }

};

exports.getAll =
async (req, res, next) => {

  try {

    const data =
      await permissionService.getAll();

    res.json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }

};

exports.getByRole =
async (req, res, next) => {

  try {

    const data =
      await permissionService.getByRole(
        req.params.roleId
      );

    res.json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }

};