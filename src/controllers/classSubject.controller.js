import * as classSubjectService from '../services/classSubject.service.js';
import { sendResponse } from '../utils/response.js';

export const listClassSubjects = async (req, res, next) => {
  try {
    const result = await classSubjectService.getClassSubjectList(req.query, req.user);
    return sendResponse(res, 200, true, 'Class subjects retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const saveClassSubject = async (req, res, next) => {
  try {
    const data = await classSubjectService.saveClassSubject(req.body, req.user);
    return sendResponse(res, 200, true, data.message, data.data);
  } catch (error) {
    next(error);
  }
};

export const removeClassSubject = async (req, res, next) => {
  try {
    await classSubjectService.deleteClassSubject(req.params.id, req.user);
    return sendResponse(res, 200, true, 'Class subject mapping deleted successfully');
  } catch (error) {
    next(error);
  }
};