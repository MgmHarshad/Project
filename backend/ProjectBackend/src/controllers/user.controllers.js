import { getUser, authMiddleware } from "../middlewares/auth.middlewares.js";
import Users from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

const getUserProfile = async (req, res) => {
  const token = req.cookies.uid;
  console.log("Received token:", token);
  console.log("All cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token" });
  }

  const decoded = getUser(token); // decoded = { id, role, email }
  if (!decoded) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
  try {
    const user = await Users.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ error: "failed to fetch user profile" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullname, phno, email, password, role } = req.body;
    let profilePicUrl = null;
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      profilePicUrl = uploadResult.secure_url;
      // cleanup temp file
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        /* ignore */
      }
    }
    const user = new Users({
      fullname,
      phno,
      email,
      password,
      role,
      profilePic: profilePicUrl,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "failed to register user" });
  }
};

const updateUser = async (req, res) => {
  try {
    // auth middleware should set req.user (decoded token or user payload)
    const authPayload = req.user;
    if (!authPayload) return res.status(401).json({ error: "Unauthorized" });

    // support different shapes
    const userId =
      authPayload._id || authPayload.id || authPayload.userId || authPayload;
    if (!userId)
      return res.status(400).json({ error: "User ID not available" });

    // Debugging helpers (remove/log as needed)
    console.log("updateUser - userId:", userId);
    console.log("updateUser - req.body:", req.body);
    console.log("updateUser - has file:", !!req.file);

    // Build update object from req.body safely
    const { fullname, phno, email, password } = req.body || {};
    const updateFields = {};
    if (fullname) updateFields.fullname = fullname;
    if (phno) updateFields.phno = phno;
    if (email) updateFields.email = email;
    if (password) updateFields.password = password; // hash if you don't have pre-save hook

    // handle profile image upload if present
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult?.secure_url)
        updateFields.profilePic = uploadResult.secure_url;
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("temp cleanup failed", e);
      }
    }
    // If no fields to update, return current user
    if (Object.keys(updateFields).length === 0) {
      const current = await Users.findById(userId).lean();
      if (!current) return res.status(404).json({ error: "User not found" });
      delete current.password;
      return res.json({ message: "No changes", user: current });
    }

    // Perform update
    const updated = await Users.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: "User not found" });
    delete updated.password;
    return res.json({ message: "User updated", user: updated });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === 11000) {
      const dup = Object.keys(error.keyValue || {}).join(", ");
      return res.status(409).json({ error: "Duplicate value", field: dup });
    }
    return res
      .status(500)
      .json({ error: "Server error", detail: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    await Users.findByIdAndDelete(userId);
    res.json({ message: "User Deleted" });
  } catch (error) {
    console.error("Error in deleting user", error);
    res.status(500).json({ error: "failed to delete user" });
  }
};

export { registerUser, getUserProfile, updateUser, deleteUser };
