import express from "express";
import multer from "multer";
import authenticateUserMiddleware from "../middlewares/authenticateUser.middleware.js";
//import getUserInfoController from "../controllers/getUserInfo.controller.js";
import addProperty from "../controllers/addproperty.controller.js";
import deleteProduct from "../controllers/deleteproperty.controller.js";
import editProduct from "../controllers/editproperty.js";
import getAllProducts from "../controllers/getproducts.controller.js";
import { uploadImage } from "../middlewares/uploadImage.middleware.js";

const router = express.Router();

const storage = multer.memoryStorage(); // buffer upload
const upload = multer({ storage });

router.post("/properties/add" , authenticateUserMiddleware, upload.single("image") ,uploadImage, addProperty);
router.post("/properties/edit/:id" ,authenticateUserMiddleware, editProduct);
router.post("/properties/delete/:id" ,authenticateUserMiddleware, deleteProduct);
router.get("/properties" , getAllProducts);

export default router;