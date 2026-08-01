export const saveImage = async(file,user)=>{


  if(!file){
    throw new Error("Image is required");
  }


  return {

    url:`/uploads/images/${file.filename}`,

    fileName:file.filename,

    size:file.size,

    mimeType:file.mimetype

  };

};