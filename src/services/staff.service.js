const { Staff } = require("../models");
const { Op } = require("sequelize");
const { hashPassword } = require("../utils/password");
const userService = require("./user.service");

/**
 * CREATE STAFF
 */
exports.create = async (payload) => {
    const hashedPassword = await hashPassword("Staff@123");
    const user = await userService.create({
        name: payload.staff_name,
        email: payload.email,
        password: hashedPassword,
        role_id: 3,
    });
    
    const staff = await Staff.create({
        user_id: user.id,
        school_id: payload.school_id,
        staff_name: payload.staff_name,
        father_name: payload.father_name,
        email: payload.email,
        contact_number: payload.contact_number,
        gender: payload.gender,
        date_of_birth: payload.date_of_birth,
        role: payload.role,
        qualification: payload.qualification,
        experience: payload.experience,
        joining_date: payload.joining_date,
        salary: payload.salary,
        profile_image: payload.profile_image,
        address: payload.address,
        status: payload.status
    });

    return staff;
};

/**
 * GET ALL STAFF (with pagination, search, sorting)
 */
exports.getAll = async (page, limit, search, sortBy, order, school_id) => {
  const offset = (page - 1) * limit;

  const where = {};


  if (school_id) {
    where.school_id = school_id;
  }

  // SEARCH FILTER
  if (search) {
    where[Op.or] = [
      {
        staff_name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        email: {
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
    "staff_name",
    "email",
    "contact_number",
    "createdAt",
    "updatedAt",
    "status"
  ];

  const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "id";

  const sortOrder =
    order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { count, rows } = await Staff.findAndCountAll({
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
 * GET BY ID
 */
exports.getById = async (id) => {
    const staff = await Staff.findByPk(id);

    if (!staff) {
        throw new Error("Staff not found");
    }

    return staff;
};

/**
 * UPDATE STAFF
 */
exports.update = async (id, payload) => {
    const staff = await Staff.findByPk(id);

    if (!staff) {
        throw new Error("Staff not found");
    }

    await Staff.update(payload, {
        where: { id }
    });

    return await Staff.findByPk(id);
};

/**
 * DELETE STAFF
 */
exports.delete = async (id) => {
    const staff = await Staff.findByPk(id);

    if (!staff) {
        throw new Error("Staff not found");
    }

    await Staff.destroy({
        where: { id }
    });

    return true;
};