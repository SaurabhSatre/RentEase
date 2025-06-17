import Image from "../models/image.model.js";

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const uploadImage = async (req, res, next) => {
  try {
    // Validate file presence
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Validate file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type. Only images are allowed." });
    }

    // Optional: Limit file size manually (already done by multer, but double check)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (req.file.size > MAX_SIZE) {
      return res.status(400).json({ error: "File size exceeds 5MB limit." });
    }

    // Save to DB
    const image = new Image({
      name: req.file.originalname,
      contentType: req.file.mimetype,
      imageData: req.file.buffer,
    });

    const savedImage = await image.save();

    // console.log(savedImage);

    req.savedImage = savedImage;

    next();

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Image upload failed", details: err.message });
  }
};