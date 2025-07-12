const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup (Memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image upload route
router.post("/", upload.single("image"), async (req, res) => {
  try {
   
    if (!req.file) {
      
      return res.status(400).json({ message: "No file uploaded" });
    }

    
    // Function to handle the stream upload to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" }, // Ensure proper file handling
          (error, result) => {
            if (result) {
              
              resolve(result);
            } else {
              
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Upload the file
    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
