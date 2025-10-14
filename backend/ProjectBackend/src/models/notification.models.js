import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    type: {
      type: String,
      enum: [
        "request_created",
        "donation_created",
        "event_created",
        "donation_claimed",
        "donation_delivered",
        "request_accepted",
        "request_delivered",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedModel: {
      type: String,
      enum: ["Requests", "Donations", "futureEvents"],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add compound unique index to prevent duplicate notifications
notificationSchema.index(
  { recipient: 1, actor: 1, type: 1, relatedId: 1 },
  { unique: true }
);

export default mongoose.model("Notifications", notificationSchema);


