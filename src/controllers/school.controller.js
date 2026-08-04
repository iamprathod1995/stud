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


export const getDashboardStats = async (req, res) => {
  try {
    // req.user middleware se mil raha hai jisme school_id available hai
    const user = req.user;

    if (!user || !user.school_id) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized or School ID missing in token"
      });
    }

    const result = await schoolService.getDashboardStatsData(user);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching dashboard data",
      error: error.message
    });
  }
};