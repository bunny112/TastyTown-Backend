import express from "express";
import Order from "../models/orders.js";
import { protect, isAdmin } from "../middleware/auth.js";


const router = express.Router();


router.put("/:id/status", protect, isAdmin, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.json({ message: "Order status updated", order });
});
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow cancel if order belongs to logged-in user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ✅ USER → PLACE ORDER */
router.post("/", protect, async (req, res) => {
  const order = new Order({
    userId: req.user._id,              // 🔐 token nundi
    restaurantId: req.body.restaurantId,
    items: req.body.items,
    customerName: req.body.customerName,
    customerPhone: req.body.customerPhone,
  });

  const savedOrder = await order.save();
  res.status(201).json(savedOrder);
});

/* ✅ USER → OWN ORDERS ONLY */
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("restaurantId", "name")
    .populate("items.menuId", "name price");

  res.json(orders);
});

/* ✅ ADMIN → ALL ORDERS */
router.get("/", protect, isAdmin, async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("restaurantId", "name")
     .populate("items.menuId", "name price image");

  res.json(orders);
});

export default router;
