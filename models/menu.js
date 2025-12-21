import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: String,
    price: Number,
    type: String,

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
