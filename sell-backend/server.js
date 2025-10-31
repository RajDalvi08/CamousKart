import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/payment.routes.js";
import authRoutes from "./routes/auth.routes.js"; // ✅ Correct import

// ✅ Load environment variables before anything else
dotenv.config({ path: "./.env" });

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // Parse JSON bodies

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// ✅ API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes); // ✅ Auth route mounted

// ✅ Serve uploaded files (if any)
app.use("/uploads", express.static("uploads"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
