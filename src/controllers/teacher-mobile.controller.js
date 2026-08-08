import * as teacherMobileService from '../services/teacher-mobile.service.js';
import { sendResponse } from '../utils/response.js';

export const punchInTeacherMobile = async (req, res, next) => {
  try {
    const data = await teacherMobileService.saveTeacherPunchIn(req.body, req.user);
    return sendResponse(res, 200, true, data.message);
  } catch (error) { next(error); }
};

export const punchOutTeacherMobile = async (req, res, next) => {
  try {
    const data = await teacherMobileService.saveTeacherPunchOut(req.body, req.user);
    return sendResponse(res, 200, true, data.message);
  } catch (error) { next(error); }
};

export const getMyAttendanceDetailMobile = async (req, res, next) => {
  try {
    const data = await teacherMobileService.getMyTeacherAttendanceDetail(req.query, req.user);
    return sendResponse(res, 200, true, 'Teacher attendance detail fetched successfully', data);
  } catch (error) { next(error); }
};