const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploader = (type) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath;

      if (type === "school") {
        uploadPath = path.join(
          process.cwd(),
          "uploads",
          "schools",
          "temp"
        );
      }

      if (type === "student") {
        uploadPath = path.join(
          process.cwd(),
          "uploads",
          "students",
          "temp"
        );
      }

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const unique =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, unique + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = createUploader;