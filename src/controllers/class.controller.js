const classService = require("../services/class.service");

/**
 * CREATE CLASS
 */
exports.create = async (req, res, next) => {
  try {
    const data = await classService.create(req.body);

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL CLASSES
 */
exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const {
      search,
      sortBy = "id",
      order = "DESC",
      school_id
    } = req.query;

    const result = await classService.getAll(
      page,
      limit,
      search,
      sortBy,
      order,
      school_id
    );

    res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET CLASS BY ID
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await classService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE CLASS
 */
exports.update = async (req, res, next) => {
  try {
    const data = await classService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE CLASS
 */
exports.delete = async (req, res, next) => {
  try {
    await classService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Class deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};