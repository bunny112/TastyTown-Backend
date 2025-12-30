import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.0,
    },
    ratingCategory: {
      type: String,
      enum: ["Excellent", "Very Good", "Good", "Average", "Poor"],
      default: "Good",
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      default: 5.0,
    },
    offers: {
      type: String,
    },
    deliveryTime: {
      type: String,
      default: "30-45 mins",
    },
    cuisine: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
