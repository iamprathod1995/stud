import * as subjectService from '../services/subject.service.js';
import { sendResponse } from '../utils/response.js';

export const listSubjects = async (req, res, next) => {
  try {
    const subjects = await subjectService.getSubjectList(req.query, req.user);
    return sendResponse(res, 200, true, 'Subjects retrieved successfully', subjects);
  } catch (error) {
    next(error);
  }
};

export const saveSubject = async (req, res, next) => {
  try {
    const data = await subjectService.saveSubject(req.body, req.user);
    return sendResponse(res, 200, true, data.message, data.data);
  } catch (error) {
    next(error);
  }
};

export const removeSubject = async (req, res, next) => {
  try {
    await subjectService.deleteSubject(req.params.id, req.user);
    return sendResponse(res, 200, true, 'Subject deleted successfully');
  } catch (error) {
    next(error);
  }
};