const userService =
require("../services/user.service");

exports.create =
async (
  req,
  res,
  next
) => {

  try {

    const data =
      await userService.create(
        req.body
      );

    res.status(201).json({

      success: true,
      data

    });

  } catch (error) {

    next(error);

  }

};

exports.getAll =
async (
  req,
  res,
  next
) => {

  try {

    const {
      page,
      limit
    } =
      req.pagination;

    const search =
      req.query.search;

    const data =
      await userService.getAll(

        page,
        limit,
        search

      );

    res.status(200).json({

      success: true,
      ...data

    });

  } catch (error) {

    next(error);

  }

};