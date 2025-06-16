import express from "express";
import authenticateUserMiddleware from "../middlewares/authenticateUser.middleware.js";
//import getUserInfoController from "../controllers/getUserInfo.controller.js";
import addProperty from "../controllers/addproperty.controller.js";
import deleteProduct from "../controllers/deleteproperty.controller.js";
import editProduct from "../controllers/editproperty.js";
import getAllProducts from "../controllers/getproducts.controller.js";

const router = express.Router();

router.post("/properties/add" , authenticateUserMiddleware, addProperty);
router.post("/properties/edit/:id" ,authenticateUserMiddleware, editProduct);
router.post("/properties/delete/:id" ,authenticateUserMiddleware, deleteProduct);
router.get("/properties" , getAllProducts);

export default router;