import mongoose from "mongoose";

// Restaurant Schema
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCategory: {
    type: String, // Good, Average, Poor
    default: "Average",
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: Number, // in kilometers
    default: 1,
  },
  offers: {
    type: String, // e.g., "20% off"
    default: "",
  },
  deliveryTime: {
    type: String, // e.g., "25-40 mins"
    default: "30-40 mins",
  },
  phone: {
    type: String,
  },
  cuisine: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Model create
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
