import express from 'express';
import cors from 'cors';
import multer from 'multer'; 

const app = express();
const PORT = 5000; 

// --- Setup ---
const corsOptions = { 
    origin: 'http://localhost:5173', 
    methods: 'GET,POST', 
    allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));

// --- In-Memory "Database" ---
const allBooks = [];
const allCalculators = [];
const allLabCoats = [];
const allDrafters = [];
const allEgKits = [];
const allEgContainers = []; // Added for new category

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() }); 

// --- API Endpoints ---

// GET /api/books
app.get('/api/books', (req, res) => {
    console.log(`Sending ${allBooks.length} books...`);
    const newBooks = allBooks.filter(book => book.condition === 'new');
    const oldBooks = allBooks.filter(book => book.condition === 'used');
    res.status(200).json({ newBooks, oldBooks });
});

// GET /api/products/calculators
app.get('/api/products/calculators', (req, res) => {
    console.log(`Sending ${allCalculators.length} calculators...`);
    res.status(200).json(allCalculators);
});

// GET /api/products/labcoats
app.get('/api/products/labcoats', (req, res) => {
    console.log(`Sending ${allLabCoats.length} lab coats...`);
    res.status(200).json(allLabCoats);
});

// GET /api/products/drafters
app.get('/api/products/drafters', (req, res) => {
    console.log(`Sending ${allDrafters.length} drafters...`);
    res.status(200).json(allDrafters);
});

// GET /api/products/EgKit
app.get('/api/products/EgKit', (req, res) => {
    console.log(`Sending ${allEgKits.length} EG kits...`);
    res.status(200).json(allEgKits);
});

// NEW: Endpoint for EGContainer.jsx
app.get('/api/products/EgContainer', (req, res) => {
    console.log(`Sending ${allEgContainers.length} EG containers/gadgets...`);
    res.status(200).json(allEgContainers);
});


/**
 * POST /api/sell/add
 * Single endpoint to handle all new product uploads
 */
app.post('/api/sell/add', upload.single('image'), (req, res) => {
    
    const productData = req.body;
    const file = req.file;

    try {
        console.log('--- Received Product Upload Request ---');

        if (!productData.title || !productData.category || !productData.price || !file) {
            return res.status(400).json({ 
                message: 'Validation failed: Title, category, price, and image are required.' 
            });
        }
        
        const imageAsBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const newProductId = Date.now(); 

        // Create a single, compatible product object
        const newProduct = {
            id: newProductId,         // For Book.jsx
            _id: newProductId,        // For other components
            title: productData.title,     // For other components
            name: productData.title,      // For Book.jsx
            price: productData.price,
            condition: productData.condition,
            img: imageAsBase64,       // For Book.jsx
            images: [imageAsBase64],  // For other components
            category: productData.category,
            location: productData.location
        };

        // --- Sorting Logic ---
        switch (productData.category) {
            case 'Books':
                allBooks.push(newProduct);
                console.log('Product (Book) created:', newProduct.name);
                break;
            case 'Calculators':
                allCalculators.push(newProduct);
                console.log('Product (Calculator) created:', newProduct.name);
                break;
            case 'Labcoats':
                allLabCoats.push(newProduct);
                console.log('Product (Lab Coat) created:', newProduct.name);
                break;
            case 'Drafters':
                allDrafters.push(newProduct);
                console.log('Product (Drafter) created:', newProduct.name);
                break;
            case 'EgKit':
                allEgKits.push(newProduct);
                console.log('Product (EG Kit) created:', newProduct.name);
                break;
            case 'EgContainer': // Added for new category
                allEgContainers.push(newProduct);
                console.log('Product (EG Container) created:', newProduct.name);
                break;
            default:
                console.log('Product (Other) created:', newProduct.name);
        }

        res.status(201).json({
            message: 'Product uploaded successfully!',
            product: newProduct,
        });

    } catch (error) {
        console.error('Server processing error:', error);
        res.status(500).json({
            message: 'An internal server error occurred during product listing.'
        });
    }
});


// --- Server Start ---
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
