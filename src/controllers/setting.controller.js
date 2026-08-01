import * as settingService from '../services/setting.service.js';
import { sendResponse } from '../utils/response.js';
import { getFileUrl } from '../config/upload.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await settingService.getSchoolSettings();
    return sendResponse(res, 200, true, 'School settings loaded', settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let logoUrl = null;
    if (req.file) {
      logoUrl = getFileUrl(req.file, req);
    }

    const updated = await settingService.updateSchoolSettings(req.body, logoUrl);
    return sendResponse(res, 200, true, 'School system settings updated successfully', updated);
  } catch (error) {
    next(error);
  }
};
