import Product from "../models/product.js";

// ✅ Fix for the 500 Internal Server Error
export const createProduct = async (req, res) => {
  try {
    // 1. Get ALL fields from the form
    const { title, category, description, price, condition, location, contactInfo } = req.body;

    // 2. Get image paths
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    const newProduct = new Product({
      title,
      category,
      description,
      price,
      condition,
      location, 
      contactInfo,
      images: imagePaths,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// controllers/productController.js
export const getProductByCategory = async (req, res) => {
  try {
    const categoryParam = req.params.category.toLowerCase().trim();

    // Build a flexible regex that matches partial or spaced words
    const regex = new RegExp(categoryParam.replace(/s$/, ""), "i");

    const products = await Product.find({
      category: { $regex: regex },
    });

    if (!products.length) {
      console.warn(`⚠️ No products found for category: ${categoryParam}`);
    }

    res.json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

// ✅ Fetch only EG Container category products
export const getEGContainers = async (req, res) => {
  try {
    const products = await Product.find({ category: "EG Container" });
    res.json(products);
  } catch (error) {
    console.error("Error fetching EG Containers:", error);
    res.status(500).json({ message: "Server error fetching EG containers" });
  }
};