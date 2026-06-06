const roleService =
require("../services/role.service");

exports.create =
async (req,res,next)=>{

 try{

  const data =
   await roleService.create(
    req.body
   );

  res.status(201).json({
    success:true,
    data
  });

 }catch(error){
  next(error);
 }

};

exports.getAll =
async(req,res,next)=>{

 try{

  const data =
   await roleService.getAll();

  res.json({
   success:true,
   data
  });

 }catch(error){
  next(error);
 }

};

exports.getById =
async(req,res,next)=>{

 try{

  const data =
   await roleService.getById(
    req.params.id
   );

  res.json({
   success:true,
   data
  });

 }catch(error){
  next(error);
 }

};

exports.update =
async(req,res,next)=>{

 try{

  const data =
   await roleService.update(
    req.params.id,
    req.body
   );

  res.json({
   success:true,
   data
  });

 }catch(error){
  next(error);
 }

};

exports.delete =
async(req,res,next)=>{

 try{

  await roleService.delete(
   req.params.id
  );

  res.json({
   success:true,
   message:"Deleted"
  });

 }catch(error){
  next(error);
 }

};