import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Access denied. Authentication Bearer token required.');
  }

  try {
    const secret = process.env.JWT_SECRET || 'sahara_academy_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 403, 'Invalid or expired JWT token.');
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized request.');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Forbidden. Role '${req.user.role}' lacks permission for this resource.`);
    }

    next();
  };
};
