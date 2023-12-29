const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const commonController = require('./src/controller/commonController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,  path.join(__dirname, '/uploads/')); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
      // Generate a unique filename by appending a timestamp to the original filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Example: Set a limit of 5 MB
  });
router.post('/getDataFromPDF', upload.single('pdfFile'),commonController.getDataFromPDF)

module.exports = router;