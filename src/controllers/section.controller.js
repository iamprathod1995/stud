import * as sectionService from '../services/section.service.js';
import { sendResponse } from '../utils/response.js';

export const listSections = async (req, res, next) => {
  try {
    const sections = await sectionService.getSectionList(req.query, req.user);
    return sendResponse(
      res,
      200,
      true,
      'Sections retrieved successfully',
      sections
    );
  } catch (error) {
    next(error);
  }
};


export const saveSection = async (req, res, next) => {
  try {
    const data = await sectionService.saveSection(
      req.body,
      req.user
    );

    return sendResponse(
      res,
      200,
      true,
      data.message,
      data.data
    );

  } catch(error) {
    next(error);
  }
};


export const removeSection = async (req,res,next)=>{
  try{

    await sectionService.deleteSection(
      req.params.id,
      req.user
    );

    return sendResponse(
      res,
      200,
      true,
      'Section deleted successfully'
    );

  }catch(error){
    next(error);
  }
};