import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// GET all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    if (!restaurants || restaurants.length === 0) {
      return res.status(200).json([]);
    }

    // Optional: Calculate ratingCategory dynamically if not seeded
    const formattedRestaurants = restaurants.map(r => ({
      _id: r._id,
      name: r.name,
      image: r.image,
      rating: r.rating,
      ratingCategory:
        r.rating >= 4 ? "Good" :
        r.rating >= 3 ? "Average" : "Poor",
      address: r.address,
      distance: r.distance || (Math.random() * 10 + 1).toFixed(1), // random distance 1-10km
      offers: r.offers || ["10% off", "20% off", "No offer"][Math.floor(Math.random() * 3)],
      deliveryTime: r.deliveryTime || `${20 + Math.floor(Math.random() * 20)}-${40 + Math.floor(Math.random() * 10)} mins`,
      cuisine: r.cuisine,
      phone: r.phone,
    }));

    res.status(200).json(formattedRestaurants);
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
