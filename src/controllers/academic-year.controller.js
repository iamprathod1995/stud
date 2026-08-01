import * as academicYearService from "../services/academic-year.service.js";
import { sendResponse } from "../utils/response.js";


export const listAcademicYears = async(req,res,next)=>{

try{


const data =
await academicYearService.getAcademicYearList(
 req.query,
 req.user
);


return sendResponse(
 res,
 200,
 true,
 "Academic years retrieved successfully",
 data
);


}
catch(error){

next(error);

}


};


export const updateAcademicYear = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRecord = await academicYearService.updateAcademicYear(
      id,
      updateData,
      req.user
    );

    return sendResponse(
      res,
      200,
      true,
      "Academic year updated successfully",
      updatedRecord
    );
  } catch (error) {
    next(error);
  }
};