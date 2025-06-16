import express from "express";
import registerUserController from "../controllers/signup.controller.js";
import loginUserController from "../controllers/login.controller.js";
import authenticateUserMiddleware from "../middlewares/authenticateUser.middleware.js";
//import getUserInfoController from "../controllers/getUserInfo.controller.js";

const router = express.Router();

router.post("/user/register" , registerUserController);
router.post("/user/login" , loginUserController);


export default router;