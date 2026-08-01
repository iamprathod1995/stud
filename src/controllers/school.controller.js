import * as schoolService from '../services/school.service.js';
import { sendResponse, sendError } from '../utils/response.js';

export const listSchools = async (req, res, next) => {
  try {
    const schools = await schoolService.getSchoolsList();
    return sendResponse(res, 200, true, 'Schools list retrieved successfully', schools);
  } catch (error) {
    next(error);
  }
};

export const getSchool = async (req, res, next) => {
  try {
    const school = await schoolService.getSchoolById(req.params.id);
    if (!school) {
      return sendError(res, 404, 'School not found.');
    }
    return sendResponse(res, 200, true, 'School details retrieved', school);
  } catch (error) {
    next(error);
  }
};

export const saveSchool = async (req, res, next) => {
  try {
    const { school_name } = req.body;
    if (!school_name) {
      return sendError(res, 400, 'School name is required.');
    }
    const school = await schoolService.createOrUpdateSchool(req.body);
    return sendResponse(res, 201, true, 'School saved successfully', school);
  } catch (error) {
    next(error);
  }
};

export const deleteSchool = async (req, res, next) => {
  try {
    await schoolService.deleteSchool(req.params.id);
    return sendResponse(res, 200, true, 'School deleted successfully');
  } catch (error) {
    next(error);
  }
};
