import multer from "multer";
import express from "express";
import { uploadImage , getImageById } from "../controllers/image.controller.js";

const router = express.Router();

const storage = multer.memoryStorage(); // buffer upload
const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadImage);
router.get("/image/:id", getImageById);

export default router;