const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    condition: { type: String, required: true },
    location: { type: String, required: true },
    contactInfo: { type: String },
    imageUrl: { type: String }, // Store the image URL or file path
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
