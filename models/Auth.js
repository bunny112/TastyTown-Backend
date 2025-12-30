import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Auth", authSchema);
