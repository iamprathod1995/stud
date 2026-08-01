const sectionService = require("../services/section.service");

/**
 * CREATE SECTION
 */
exports.create = async (req, res, next) => {
  try {
    const data = await sectionService.create(req.body);

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL SECTIONS
 */
exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const {
      search,
      sortBy = "id",
      order = "DESC",
      school_id,
      class_id
    } = req.query;

    const result = await sectionService.getAll(
      page,
      limit,
      search,
      sortBy,
      order,
      school_id,
      class_id
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
 * GET SECTION BY ID
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await sectionService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE SECTION
 */
exports.update = async (req, res, next) => {
  try {
    const data = await sectionService.update(
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
 * DELETE SECTION
 */
exports.delete = async (req, res, next) => {
  try {
    await sectionService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Section deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};