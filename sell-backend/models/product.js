import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },

  // --- FIX 1 ---
  // Changed "old" to "used" to match what your Sell.jsx form sends.
  // This will fix the 500 Internal Server Error.
  condition: { type: String, enum: ["new", "used"], required: true },

  // --- FIX 2 ---
  // Added the missing fields from your form.
  // Your form has location as required, so we add "required: true" here.
  location: { type: String, required: true },
  contactInfo: { type: String }, // Optional, so no "required"

  images: [String],
}, {
  // This is good practice, it adds `createdAt` and `updatedAt` fields
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;