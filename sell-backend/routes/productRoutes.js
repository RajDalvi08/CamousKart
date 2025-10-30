import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/product.js";
import {
  createProduct,
  getProducts,
  getProductByCategory,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    ),
});

// ✅ File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only JPEG and PNG allowed."), false);
};

const upload = multer({ storage, fileFilter });

// ✅ Create new product
router.post("/", upload.array("images"), createProduct);

// ✅ Get all products
router.get("/", getProducts);

// ✅ Get products by category (e.g. /api/products/category/labcoat)
router.get("/category/:category", getProductByCategory);

// ✅ Get only EG Containers
router.get("/egcontainer", async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: /^eg\s*container$/i },
    });

    if (!products.length)
      return res.status(404).json({ message: "No EG Containers found" });

    res.json(products);
  } catch (err) {
    console.error("Error fetching EG Containers:", err);
    res.status(500).json({ message: "Failed to fetch EG Containers" });
  }
});

// ✅ Get only Lab Coats
router.get("/labcoat", async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: /^lab\s*coat$/i }, // Matches "lab coat" or "Labcoat"
    });

    if (!products.length)
      return res.status(404).json({ message: "No Lab Coats found" });

    res.json(products);
  } catch (err) {
    console.error("Error fetching Lab Coats:", err);
    res.status(500).json({ message: "Failed to fetch Lab Coats" });
  }
});

// ✅ Fetch by category (EgKit)
router.get("/egkit", async (req, res) => {
  try {
    const egkits = await Product.find({ category: "EgKit" });
    res.json(egkits);
  } catch (error) {
    console.error("Error fetching EgKit:", error);
    res.status(500).json({ message: "Server error fetching EgKits" });
  }
});

export default router;
