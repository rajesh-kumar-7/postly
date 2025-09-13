// upload.js
const multer = require('multer');

// use memory storage
const storage = multer.memoryStorage();

// create the upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
