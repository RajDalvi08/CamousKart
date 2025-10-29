import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount is required" });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      payment_capture: 1,
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
