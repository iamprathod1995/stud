import {Router} from "express";
import {uploadSingleImage} from "../controllers/upload.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";
import {uploadImage} from "../middlewares/upload.middleware.js";


const router=Router();


router.use(authenticateToken);


router.post(
  "/image",
  uploadImage.single("image"),
  uploadSingleImage
);


export default router;