import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    let { amount } = req.body;

    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ error: "Amount must be at least ₹1" });
    }

    amount = Math.round(amount * 100); // convert to paise

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("🧾 Razorpay Order Created:", order);

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Razorpay Error:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
