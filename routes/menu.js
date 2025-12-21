import express from "express";
import Menu from "../models/menu.js";

const router = express.Router();

/* GET MENU BY RESTAURANT ID */
router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menu = await Menu.find({ restaurantId });
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

export default router;   // 🔥 THIS LINE IS MUST
