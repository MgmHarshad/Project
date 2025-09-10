import mongoose, { Schema } from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    peopleCount: {
      type: Number,
      required: true,
    },
    preferredTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Matched with Donor",
        "Out for Delivery",
        "Delivered",
        "Declined",
      ],
      default: "Pending",
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Requests", requestSchema);
