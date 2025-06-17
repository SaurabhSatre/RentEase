// models/Image.js
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: String,
  contentType: String,
  imageData: Buffer, // byte format
}, { timestamps: true });

export default mongoose.model("Image", imageSchema);