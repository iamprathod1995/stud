import * as authService from '../services/auth.service.js';
import { sendResponse, sendError } from '../utils/response.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendResponse(res, 200, true, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return sendResponse(res, 200, true, 'User profile retrieved', req.user);
};

export const logout = async (req, res) => {
  return sendResponse(res, 200, true, 'Successfully logged out');
};
