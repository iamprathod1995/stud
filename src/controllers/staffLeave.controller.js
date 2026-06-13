const staffLeaveService = require("../services/staffLeave.service");

/**
 * APPLY LEAVE
 */
exports.create = async (req, res, next) => {
  try {
    const data = await staffLeaveService.create(req.body);

    res.status(201).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL LEAVES
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
      status,
      staff_id
    } = req.query;

    const result = await staffLeaveService.getAll(
      page,
      limit,
      search,
      sortBy,
      order,
      school_id,
      status,
      staff_id
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
 * GET LEAVE BY ID
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await staffLeaveService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE LEAVE
 */
exports.update = async (req, res, next) => {
  try {
    const data = await staffLeaveService.update(
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
 * APPROVE LEAVE
 */
exports.approve = async (req, res, next) => {
  try {
    const data = await staffLeaveService.approve(
      req.params.id,
      req.body.approved_by,
      req.body.admin_remark
    );

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * REJECT LEAVE
 */
exports.reject = async (req, res, next) => {
  try {
    const data = await staffLeaveService.reject(
      req.params.id,
      req.body.approved_by,
      req.body.admin_remark
    );

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE LEAVE
 */
exports.delete = async (req, res, next) => {
  try {
    await staffLeaveService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Leave deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};