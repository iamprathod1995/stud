const authService =
require("../services/auth.service");

exports.register =
async (req, res, next) => {

  try {

    const user =
      await authService.register(
        req.body
      );

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

exports.login =
async (req, res, next) => {

  try {

    const result =
      await authService.login(
        req.body.email,
        req.body.password
      );

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

exports.logout =
async (req, res, next) => {

  try {

    await authService.logout(
      req.body.refreshToken
    );

    res.status(200).json({
      success: true,
      message:
        "Logout successful"
    });

  } catch (error) {
    next(error);
  }
};

exports.profile =
async (req, res, next) => {

  try {

    res.status(200).json({
      success: true,
      user: req.user
    });

  } catch (error) {
    next(error);
  }
};