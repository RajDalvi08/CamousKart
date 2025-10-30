import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    // ✅ Initialize Razorpay using environment variables
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("✅ Razorpay initialized with:", process.env.RAZORPAY_KEY_ID);

    // ✅ Options for the order
    const options = {
      amount: req.body.amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_order_123",
    };

    // ✅ Create order
    const order = await razorpay.orders.create(options);

    console.log("🧾 Razorpay Order Created:", order.id);

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Razorpay Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
