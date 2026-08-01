const studentService = require("../services/student.service");
const path = require("path");
const fs = require("fs");

/**
 * CREATE STUDENT
 */


exports.create = async (req, res, next) => {
  try {
    let profileImage = null;

    if (req.file) {
      const schoolId = req.body.school_id;

      const targetDir = path.join(
        process.cwd(),
        "uploads",
        "schools",
        `school_${schoolId}`,
        "Students"
      );

      fs.mkdirSync(targetDir, { recursive: true });

      const targetPath = path.join(
        targetDir,
        req.file.filename
      );

      fs.renameSync(req.file.path, targetPath);

      profileImage = targetPath.split(path.sep).join("/");
    }

    const payload = {
      ...req.body,
      profile_image: profileImage
    };

    const data = await studentService.create(payload);

    res.status(201).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL STUDENTS
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
      class_id,
      section_id
    } = req.query;

    const result = await studentService.getAll(
      page,
      limit,
      search,
      sortBy,
      order,
      school_id,
      class_id,
      section_id
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
 * GET STUDENT BY ID
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await studentService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};


/**
 * UPDATE STUDENT
 */


exports.update = async (req, res, next) => {
  try {
    const file = req.file;

    // 🔥 Get existing student
    const student = await studentService.getById(req.params.id);

    const folderPath = path.join(
      process.cwd(),
      "uploads",
      "schools",
      `school_${student.school_id}`,
      "Students"
    );

    // 🔥 remove unwanted fields (optional safety)
    const { admission_no, email, ...safeBody } = req.body;

    // 🔥 old image delete
    if (file && student.profile_image) {
      const oldFilePath = path.join(
        process.cwd(),
        student.profile_image
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // 🔥 move new file
    if (file) {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const newPath = path.join(folderPath, file.filename);
      fs.renameSync(file.path, newPath);
    }

    // 🔥 update DB
    const data = await studentService.update(req.params.id, {
      ...safeBody,
      profile_image: file
        ? path
            .join(
              "uploads",
              "schools",
              `school_${student.school_id}`,
              "Students",
              file.filename
            )
            .replace(/\\/g, "/")
        : student.profile_image
    });

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE STUDENT
 */
exports.delete = async (req, res, next) => {
  try {
    await studentService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};