const staffService = require("../services/staff.service");

/**
 * CREATE STAFF
 */
exports.create = async (req, res, next) => {
  try {
    const data = await staffService.create(req.body);

    res.status(201).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL STAFF
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

    const result = await staffService.getAll(
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
 * GET BY ID
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await staffService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE STAFF
 */
exports.update = async (req, res, next) => {
  try {
    const data = await staffService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE STAFF
 */
exports.delete = async (req, res, next) => {
  try {
    await staffService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};