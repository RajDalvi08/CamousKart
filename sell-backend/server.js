import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/payment.routes.js";

// ✅ Load environment variables before anything else
dotenv.config({ path: "./.env" });

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware setup
app.use(cors({
  origin: "http://localhost:5173", // allow frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // important for reading req.body

// ✅ Basic health check route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
