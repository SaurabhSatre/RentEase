import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";


import  bcrypt from "bcryptjs";
import { validateEmail, validatePassword } from "../utils/helper.functions.js";


const registerUserController =  async (req, res) => {

    const {email , name , password }  = req.body;

    if (!name || name.trim().length < 2) {
        return res.json({ success: false, status: 400, message: "Name must be at least 2 characters long!" });
    }    

    if(!email || !name || !password || !validateEmail(email) || !validatePassword(password)){
        res.json({ success: false, status: 400, message : "Data is not correct!!" });
        return;
    }

    try {
      let checkEmail = await UserModel.findOne({ email: req.body.email });

      if (checkEmail) {
          return res.json({ success: false, status: 400, message: "User Already Exists!!" });
      }
      
    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.password, salt);

  
  
  
    await UserModel.create({
        name : req.body.name,
        password : securePassword,
        email : req.body.email
      });
      
      res.status(201).json({ success: true , message : "User Signed up successfully!!" });
    } catch (error) {
        console.error("Error in registerUserController:", error);
        res.status(500).json({ success: false, message: "An internal server error occurred." });
    }    
  };

  export default registerUserController;