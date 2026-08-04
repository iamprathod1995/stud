import * as mappingService from '../services/teacherMapping.service.js';
import { sendResponse } from '../utils/response.js';

export const listTeacherMappings = async (req, res, next) => {
  try {
    const mappings = await mappingService.getMappingList(req.query, req.user);
    return sendResponse(res, 200, true, 'Teacher mappings retrieved successfully', mappings);
  } catch (error) {
    next(error);
  }
};

export const saveTeacherMapping = async (req, res, next) => {
  try {
    const data = await mappingService.saveMapping(req.body, req.user);
    return sendResponse(res, 200, true, data.message, data.data);
  } catch (error) {
    next(error);
  }
};

export const removeTeacherMapping = async (req, res, next) => {
  try {
    await mappingService.deleteMapping(req.params.id, req.user);
    return sendResponse(res, 200, true, 'Teacher mapping deleted successfully');
  } catch (error) {
    next(error);
  }
};