import * as teacherService from '../services/teacher.service.js';
import { sendResponse } from '../utils/response.js';

export const listTeachers = async (req, res, next) => {
  try {
    const teachers = await teacherService.getTeacherList(req.query, req.user);
    return sendResponse(res, 200, true, 'Teachers retrieved successfully', teachers);
  } catch (error) { next(error); }
};

export const saveTeacher = async (req, res, next) => {
  try {
    const data = await teacherService.saveTeacher(req.body, req.user);
    return sendResponse(res, 200, true, data.message, data.data);
  } catch (error) { next(error); }
};

export const removeTeacher = async (req, res, next) => {
  try {
    await teacherService.deleteTeacher(req.params.id, req.user);
    return sendResponse(res, 200, true, 'Teacher deleted successfully');
  } catch (error) { next(error); }
};

// Mobile App Attendance Handlers
export const punchInTeacher = async (req, res, next) => {
  try {
    const data = await teacherService.saveTeacherPunchIn(req.body, req.user);
    return sendResponse(res, 200, true, data.message);
  } catch (error) { next(error); }
};

export const punchOutTeacher = async (req, res, next) => {
  try {
    const data = await teacherService.saveTeacherPunchOut(req.body, req.user);
    return sendResponse(res, 200, true, data.message);
  } catch (error) { next(error); }
};

// Admin Attendance Handlers
export const adminSaveAttendance = async (req, res, next) => {
  try {
    const data = await teacherService.adminSaveAttendance(req.body, req.user);
    return sendResponse(res, 200, true, data.message);
  } catch (error) { next(error); }
};

export const getAttendanceByDate = async (req, res, next) => {
  try {
    const data = await teacherService.getAttendanceByDate(req.query, req.user);
    return sendResponse(res, 200, true, 'Attendance sheet fetched successfully', data);
  } catch (error) { next(error); }
};

export const removeTeacherAttendance = async (req, res, next) => {
  try {
    await teacherService.deleteTeacherAttendance(req.params.id, req.user);
    return sendResponse(res, 200, true, 'Teacher attendance deleted successfully');
  } catch (error) { next(error); }
};

export const getTeacherAttendanceDetail = async (req, res, next) => {
  try {
    const data = await teacherService.getTeacherAttendanceDetail(req.query, req.user);
    return sendResponse(res, 200, true, 'Teacher attendance detail fetched successfully', data);
  } catch (error) { next(error); }
};

// Bulk Admin Attendance Handler
export const bulkAdminSaveAttendance = async (req, res, next) => {
  try {
    const data = await teacherService.bulkAdminSaveAttendance(req.body, req.user);
    return sendResponse(res, 200, true, data.message);
  } catch (error) { next(error); }
};