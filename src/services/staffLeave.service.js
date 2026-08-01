const { StaffLeave, Staff } = require("../models");
const { Op } = require("sequelize");

/**
 * APPLY LEAVE
 */
exports.create = async (payload) => {
    const leave = await StaffLeave.create({
        school_id: payload.school_id,
        staff_id: payload.staff_id,
        leave_type: payload.leave_type,
        from_date: payload.from_date,
        to_date: payload.to_date,
        total_days: payload.total_days,
        reason: payload.reason,
        status: 0 // Pending
    });

    return leave;
};

/**
 * GET ALL LEAVES
 */
exports.getAll = async (
    page,
    limit,
    search,
    sortBy,
    order,
    school_id,
    status,
    staff_id,
    leave_type,
    from_date,
    to_date
) => {
    const offset = (page - 1) * limit;

    const where = {};

    // 🔹 Filters
    if (school_id) where.school_id = school_id;
    if (status !== undefined) where.status = status;
    if (staff_id) where.staff_id = staff_id;
    if (leave_type) where.leave_type = leave_type;

    // 🔹 Date range filter
    if (from_date && to_date) {
        where.from_date = {
            [Op.between]: [from_date, to_date]
        };
    }

    // 🔹 SEARCH (reason + staff name)
    const searchCondition = search
        ? {
            [Op.or]: [
                {
                    reason: {
                        [Op.like]: `%${search}%`
                    }
                }
            ]
        }
        : null;

    const finalWhere = searchCondition
        ? { ...where, ...searchCondition }
        : where;

    // 🔹 Allowed sort fields
    const allowedSortFields = [
        "id",
        "from_date",
        "to_date",
        "status",
        "created_at",
        "updated_at",
        "leave_type"
    ];

    const sortField = allowedSortFields.includes(sortBy)
        ? sortBy
        : "id";

    const sortOrder =
        order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count, rows } =
        await StaffLeave.findAndCountAll({
            where: finalWhere,

            include: [
                {
                    model: Staff,
                    as: "staff",
                    attributes: ["id", "staff_name", "email"],
                    required: false
                },
                {
                    model: Staff,
                    as: "approver",
                    attributes: ["id", "staff_name"],
                    required: false
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
 * GET LEAVE BY ID
 */
exports.getById = async (id) => {
    const leave = await StaffLeave.findByPk(id, {
        include: [
            {
                model: Staff,
                as: "staff",
                attributes: [
                    "id",
                    "staff_name",
                    "email"
                ]
            },
            {
                model: Staff,
                as: "approver",
                attributes: [
                    "id",
                    "staff_name"
                ],
                required: false
            }
        ]
    });

    if (!leave) {
        throw new Error("Leave not found");
    }

    return leave;
};

/**
 * UPDATE LEAVE
 */
exports.update = async (id, payload) => {
    const leave = await StaffLeave.findByPk(id);

    if (!leave) {
        throw new Error("Leave not found");
    }

    if (leave.status !== 0) {
        throw new Error(
            "Approved/Rejected leave cannot be updated"
        );
    }

    await StaffLeave.update(payload, {
        where: { id }
    });

    return await StaffLeave.findByPk(id);
};

/**
 * APPROVE LEAVE
 */
exports.approve = async (
    id,
    approved_by,
    admin_remark
) => {
    const leave = await StaffLeave.findByPk(id);

    if (!leave) {
        throw new Error("Leave not found");
    }

    await StaffLeave.update(
        {
            status: 1,
            approved_by,
            approved_at: new Date(),
            admin_remark
        },
        {
            where: { id }
        }
    );

    return await StaffLeave.findByPk(id);
};

/**
 * REJECT LEAVE
 */
exports.reject = async (
    id,
    approved_by,
    admin_remark
) => {
    const leave = await StaffLeave.findByPk(id);

    if (!leave) {
        throw new Error("Leave not found");
    }

    await StaffLeave.update(
        {
            status: 2,
            approved_by,
            approved_at: new Date(),
            admin_remark
        },
        {
            where: { id }
        }
    );

    return await StaffLeave.findByPk(id);
};

/**
 * DELETE LEAVE
 */
exports.delete = async (id) => {
    const leave = await StaffLeave.findByPk(id);

    if (!leave) {
        throw new Error("Leave not found");
    }

    await StaffLeave.destroy({
        where: { id }
    });

    return true;
};