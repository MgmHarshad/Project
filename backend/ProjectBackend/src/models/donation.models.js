import mongoose from "mongoose";

let donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["Kg", "Litres", "Pieces", "Packets"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    locationName: {
      type: String,
      default: "",
    },
    expiryDuration: {
      type: Number,
      required: true,
    },
    expiryTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "available",
        "matched",
        "delivered",
        "expired",
      ],
      default: "available",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    // ML-enriched fields
    spoilageRisk: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    remainingFreshHours: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

donationSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("expiryDuration")) {
    this.expiryTime = new Date(
      Date.now() + this.expiryDuration * 60 * 60 * 1000
    );
  }
  next();
});

export default mongoose.model("Donations", donationSchema);
