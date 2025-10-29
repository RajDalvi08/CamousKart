import express from 'express';
import multer from 'multer';
import path from 'path';

// Create an express router
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage: storage });

// POST route for creating a new product with images
router.post('/', upload.array('images', 5), (req, res) => {
  try {
    // Extract fields from the request body
    const { title, category, description, price, condition, location, contactInfo } = req.body;
    
    // Handle images (Multer will add files to req.files)
    const images = req.files;

    if (!title || !category || !price || !location || !contactInfo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Simulating product save (in a real app, you would save this to the database)
    const newProduct = {
      title,
      category,
      description,
      price,
      condition,
      location,
      contactInfo,
      images: images.map(file => `/uploads/${file.filename}`), // Save image paths
    };

    // Response with the new product data (in a real app, you would save to DB here)
    res.status(200).json({
      message: 'Product uploaded successfully!',
      product: newProduct
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
});

export default router;
