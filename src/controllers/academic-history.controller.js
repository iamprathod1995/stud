import * as academicService from "../services/academic-history.service.js";
import { sendResponse } from "../utils/response.js";



export const listPromotionStudents = async(req,res,next)=>{

  try{

    const data = await academicService.getPromotionList(
      req.query,
      req.user
    );


    return sendResponse(
      res,
      200,
      true,
      "Promotion students retrieved successfully",
      data
    );


  }catch(error){
    next(error);
  }

};




export const promoteStudents = async(req,res,next)=>{

  try{

    const data = await academicService.promoteStudents(
      req.body,
      req.user
    );


    return sendResponse(
      res,
      200,
      true,
      "Students promoted successfully",
      data
    );


  }catch(error){
    next(error);
  }

};