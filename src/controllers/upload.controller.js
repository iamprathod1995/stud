import * as uploadService from "../services/upload.service.js";
import {sendResponse} from "../utils/response.js";


export const uploadSingleImage = async(req,res,next)=>{

  try{

    const result =
      await uploadService.saveImage(req.file,req.user);


    return sendResponse(
      res,
      200,
      true,
      "Image uploaded successfully",
      result
    );


  }catch(error){
    next(error);
  }

};