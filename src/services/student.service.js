const { Student } = require("../models");
const { Op } = require("sequelize");

/**
 * CREATE STUDENT
 */
exports.create = async (payload) => {
  const student = await Student.create({
    school_id: payload.school_id,
    student_name: payload.student_name,
    father_name: payload.father_name,
    mother_name: payload.mother_name,
    admission_no: payload.admission_no,
    roll_no: payload.roll_no,
    class_id: payload.class_id,
    section_id: payload.section_id,
    email: payload.email,
    contact_number: payload.contact_number,
    gender: payload.gender,
    date_of_birth: payload.date_of_birth,
    admission_date: payload.admission_date,
    profile_image: payload.profile_image,
    address: payload.address,
    status: payload.status
  });

  return student;
};

/**
 * GET ALL STUDENTS
 */
exports.getAll = async (
  page,
  limit,
  search,
  sortBy,
  order,
  school_id
) => {
  const offset = (page - 1) * limit;

  const where = {};

  if (school_id) {
    where.school_id = school_id;
  }

  if (search) {
    where[Op.or] = [
      {
        student_name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        admission_no: {
          [Op.like]: `%${search}%`
        }
      },
      {
        roll_no: {
          [Op.like]: `%${search}%`
        }
      },
      {
        father_name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        contact_number: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }

  const allowedSortFields = [
    "id",
    "student_name",
    "admission_no",
    "roll_no",
    "createdAt",
    "updatedAt",
    "status"
  ];

  const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "id";

  const sortOrder =
    order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { count, rows } = await Student.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortField, sortOrder]]
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * GET STUDENT BY ID
 */
exports.getById = async (id) => {
  const student = await Student.findByPk(id);

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
};

/**
 * UPDATE STUDENT
 */
exports.update = async (id, payload) => {
  const student = await Student.findByPk(id);

  if (!student) {
    throw new Error("Student not found");
  }

  await Student.update(payload, {
    where: { id }
  });

  return await Student.findByPk(id);
};

/**
 * DELETE STUDENT
 */
exports.delete = async (id) => {
  const student = await Student.findByPk(id);

  if (!student) {
    throw new Error("Student not found");
  }

  await Student.destroy({
    where: { id }
  });

  return true;
};