import multer from 'multer';
import path from 'path';

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads'); // Directory where files will be stored
    cb(null, uploadDir);  // Set destination to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Save file with a unique name using timestamp to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

// Filter to accept only image files (product images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);  // Accept image files
  } else {
    cb(new Error('Not an image file'), false);  // Reject non-image files
  }
};

// Create multer instance with storage options and file size limit (10MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit files to 10MB
});

export default upload;
