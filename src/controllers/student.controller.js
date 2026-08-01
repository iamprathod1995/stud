import * as studentService from '../services/student.service.js';
import { sendResponse } from '../utils/response.js';

export const listStudents = async (req, res, next) => {
  try {
    const students = await studentService.getStudentList(req.query, req.user);
    return sendResponse(res, 200, true, 'Students retrieved successfully', students);
  } catch (error) {
    next(error);
  }
};

export const saveStudent = async (req, res, next) => {
  try {
    const data = await studentService.saveStudent(req.body, req.user);
    return sendResponse(res, 200, true, data.message, data.data);
  } catch (error) {
    next(error);
  }
};

export const removeStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id, req.user);
    return sendResponse(res, 200, true, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};