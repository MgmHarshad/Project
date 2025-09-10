import express from "express";
const router = express.Router();
import {
  registerUser,
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";
import { loginUsers } from "../controllers/login.controllers.js";
import { logoutUser } from "../controllers/logout.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

// ...existing code...
const uploadSingleIfFormData = (req, res, next) => {
  const ct = (req.headers["content-type"] || "").toLowerCase();
  console.log("uploadSingleIfFormData - content-type:", ct);

  // only run multer when content-type explicitly contains multipart/form-data and a boundary
  if (ct.includes("multipart/form-data") && ct.includes("boundary=")) {
    try {
      return upload.single("profilePic")(req, res, next);
    } catch (e) {
      console.warn("multer threw synchronously:", e);
      return next();
    }
  }
  return next();
};

router.post("/users", upload.single("profilePic"), registerUser);

router.post("/login", loginUsers);

router.post("/logout", logoutUser);

router.get("/user", getUserProfile);

router.put("/update", authMiddleware, uploadSingleIfFormData, updateUser);

router.delete("/delete", authMiddleware, deleteUser);

// router.put('/update', upload.single("profilePic"), updateUser);

export default router;
