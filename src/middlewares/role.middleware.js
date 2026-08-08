export const isTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== 4) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Unauthorized role for mobile app"
    });
  }
  next();
};