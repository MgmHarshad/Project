import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phno: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["donor", "receiver"], required: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
