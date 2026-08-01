import * as classService from '../services/class.service.js';
import { sendResponse } from '../utils/response.js';

export const listClasses = async(req,res,next)=>{
  try{
    const classes=await classService.getClassList(req.query,req.user);
    return sendResponse(res,200,true,'Classes retrieved successfully',classes);
  }catch(error){
    next(error);
  }
};

export const saveClass = async(req,res,next)=>{
  try{
    const data=await classService.saveClass(req.body,req.user);
    return sendResponse(res,200,true,data.message,data.data);
  }catch(error){
    next(error);
  }
};

export const removeClass = async(req,res,next)=>{
  try{
    await classService.deleteClass(req.params.id,req.user);
    return sendResponse(res,200,true,'Class deleted successfully');
  }catch(error){
    next(error);
  }
};