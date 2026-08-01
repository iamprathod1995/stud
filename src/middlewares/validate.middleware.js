import { sendError } from '../utils/response.js';

export const validateStudentData = (req, res, next) => {
  const { firstName, lastName, grade, section } = req.body;
  const errors = [];

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name is required.' });
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name is required.' });
  }

  if (!grade || typeof grade !== 'string' || grade.trim().length === 0) {
    errors.push({ field: 'grade', message: 'Grade is required.' });
  }

  if (!section || typeof section !== 'string' || section.trim().length === 0) {
    errors.push({ field: 'section', message: 'Section is required.' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed for input data.', errors);
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.includes('@')) {
    errors.push({ field: 'email', message: 'Valid email is required.' });
  }

  if (!password || password.trim().length === 0) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Invalid login credentials provided.', errors);
  }

  next();
};
