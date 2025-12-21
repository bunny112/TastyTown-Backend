import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "../models/Restaurant.js";
import Menu from "../models/menu.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* ================== DATA ================== */
const restaurantNames = [
  "Spice Hub",
  "Royal Biryani",
  "Pizza Town",
  "Burger Junction",
  "Sushi House",
  "Urban Tandoor",
  "Grill Nation",
  "Food Street",
  "The Golden Spoon",
  "Saffron Table",
  "Crown Kitchen",
  "Swagath Grand",
  "Quick Bites",
  "Snack Shack",
  "Burger Bay",
  "Pizza Plaza",
  "Cafe Cravings",
  "Rolls & Bowls",
  "Hot & Fresh",
  "Street Treats",
  "Chill Bites",
  "Food Garage"
];

const cities = ["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Delhi", "Pune", "Kolkata"];

const restaurantImages = [
  "restaurant1.jpg",
  "restaurant2.jpg",
  "restaurant3.jpg",
  "restaurant4.jpg",
  "restaurant6.jpg",
  "restaurant7.jpg",
  "restaurant8.jpg",
  "restaurant9.jpg",
  "restaurant10.jpg",
  "restaurant11.jpg",
  "restaurant12.jpg",
];

/* 🔥 DISH + IMAGE MAPPING */
const dishes = [
  { name: "Margherita Pizza", type: "veg", price: 299, image: "pizza.jpg" },
  { name: "Pepperoni Pizza", type: "non-veg", price: 349, image: "pizza.jpg" },
  { name: "Veg Burger", type: "veg", price: 149, image: "burger.jpg" },
  { name: "Chicken Burger", type: "non-veg", price: 199, image: "burger2.jpg" },
  { name: "Chicken Biryani", type: "non-veg", price: 299, image: "biryani.jpg" },
  { name: "Veg Biryani", type: "veg", price: 249, image: "biryani1.jpg" },
  { name: "Masala Dosa", type: "veg", price: 99, image: "dosa1.jpg" },
  { name: "Paneer Dosa", type: "veg", price: 129, image: "dosa1.jpg" },
  { name: "Margherita Pizza", type: "veg", price: 299, image: "pizza.jpg" },
  { name: "Pepperoni Pizza", type: "non-veg", price: 349, image: "pizza.jpg" },
  { name: "Veg Burger", type: "veg", price: 149, image: "burger.jpg" },
  { name: "Chicken Burger", type: "non-veg", price: 199, image: "burger2.jpg" },
  { name: "Chicken Biryani", type: "non-veg", price: 299, image: "biryani.jpg" },
  { name: "Veg Biryani", type: "veg", price: 249, image: "biryani1.jpg" },
  { name: "Masala Dosa", type: "veg", price: 99, image: "dosa1.jpg" },
  { name: "Paneer Dosa", type: "veg", price: 129, image: "dosa1.jpg" },
];

/* ================== HELPERS ================== */
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomRating = () => Number((Math.random() * 2 + 3).toFixed(1));
const getRatingCategory = (rating) => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  return "Average";
};
const randomDistance = () => Number((Math.random() * 9 + 1).toFixed(1)); // 1–10 km
const randomOffer = () => {
  const offers = ["20% off on orders above ₹300", "Free delivery", "Buy 1 Get 1 Free", "10% Cashback"];
  return random(offers);
};
const randomDeliveryTime = () => `${Math.floor(Math.random() * 20 + 20)}–${Math.floor(Math.random() * 15 + 35)} mins`;

/* ================== SEED ================== */
const seedDB = async () => {
  try {
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    const restaurants = await Restaurant.insertMany(
      Array.from({ length: 20 }).map((_, i) => {
        const rating = randomRating();
        return {
          name: `${random(restaurantNames)} ${i + 1}`,
          image: `/uploads/${random(restaurantImages)}`,
          rating: rating,
          ratingCategory: getRatingCategory(rating),
          address: random(cities),
          distance: randomDistance(), // km
          offers: randomOffer(),
          cuisine: ["Indian", "Fast Food"],
          deliveryTime: randomDeliveryTime(),
        };
      })
    );

    const menus = [];
    restaurants.forEach((restaurant) => {
      dishes.forEach((dish) => {
        menus.push({
          restaurantId: restaurant._id,
          name: dish.name,
          price: dish.price,
          type: dish.type,
          image: `/uploads/${dish.image}`,
        });
      });
    });

    await Menu.insertMany(menus);

    console.log("✅ Seed success with Zomato-style details!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDB();
