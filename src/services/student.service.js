const { Student, School, Class, Section } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

/**
 * CREATE STUDENT
 */
exports.create = async (payload) => {

  // Check duplicate admission number
  const existingStudent = await Student.findOne({
    where: {
      admission_no: payload.admission_no
    }
  });

  if (existingStudent) {
    throw new Error(
      `Admission No '${payload.admission_no}' already exists`
    );
  }

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
  school_id,
  class_id,
  section_id
) => {
  const offset = (page - 1) * limit;

  const where = {};

  // school filter
  if (school_id) {
    where.school_id = school_id;
  }

  // class filter
  if (class_id) {
    where.class_id = class_id;
  }

  // section filter
  if (section_id) {
    where.section_id = section_id;
  }

  // search filter
  if (search) {
    where[Op.or] = [
      { student_name: { [Op.like]: `%${search}%` } },
      { admission_no: { [Op.like]: `%${search}%` } },
      { roll_no: { [Op.like]: `%${search}%` } },
      { father_name: { [Op.like]: `%${search}%` } },
      { contact_number: { [Op.like]: `%${search}%` } }
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
    include: [
        {
            model: School,
            as: "school",
            attributes: ["id", "school_name"]
        },
        {
            model: Class,
            as: "class",
            attributes: ["id", "class_name"]
        },
        {
            model: Section,
            as: "section",
            attributes: ["id", "section_name"]
        }
    ],
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

  // Admission No duplicate check
  if (
    payload.admission_no &&
    payload.admission_no !== student.admission_no
  ) {
    const existingStudent = await Student.findOne({
      where: {
        admission_no: payload.admission_no,
        id: {
          [Op.ne]: id
        }
      }
    });

    if (existingStudent) {
      throw new Error(
        `Admission No '${payload.admission_no}' already exists`
      );
    }
  }

  

  await student.update(payload);

  return await Student.findByPk(id, {
    include: [
      {
        model: School,
        as: "school",
        attributes: ["id", "school_name"]
      },
      {
        model: Class,
        as: "class",
        attributes: ["id", "class_name"]
      },
      {
        model: Section,
        as: "section",
        attributes: ["id", "section_name"]
      }
    ]
  });
};
/**
 * DELETE STUDENT
 */
exports.delete = async (id) => {
  const student = await Student.findByPk(id);

  if (!student) {
    throw new Error("Student not found");
  }

  const folderPath = path.join(
    process.cwd(),
    "uploads",
    "schools",
    `school_${student.school_id}`,
    "Students",
    `student_${student.id}`
  );

  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, {
      recursive: true,
      force: true
    });
  }

  await Student.destroy({
    where: { id: student.id }
  });

  return true;
};