const moduleService =
require("../services/module.service");

exports.create =
async (req, res, next) => {

  try {

    const data =
      await moduleService.create(
        req.body
      );

    return res.status(201).json({
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
      await moduleService.getAll();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }

};

exports.getById =
async (req, res, next) => {

  try {

    const data =
      await moduleService.getById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }

};

exports.update =
async (req, res, next) => {

  try {

    const data =
      await moduleService.update(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }

};

exports.delete =
async (req, res, next) => {

  try {

    await moduleService.delete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Module deleted successfully"
    });

  } catch (error) {
    next(error);
  }

};