import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },

  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);

    const fileName =
      Date.now() + "-" + Math.round(Math.random() * 999999) + ext;

    cb(null, fileName);
  }

});


const fileFilter = (req,file,cb)=>{

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];


  if(allowed.includes(file.mimetype)){
    cb(null,true);
  }
  else{
    cb(new Error("Only image files are allowed"),false);
  }

};



export const uploadImage = multer({
  storage,
  fileFilter,
  limits:{
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});