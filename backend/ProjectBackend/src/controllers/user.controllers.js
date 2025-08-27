import { getUser } from "../middlewares/auth.middlewares.js";
import Users from "../models/users.models.js";

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
    const { fullname, username, email, password, role } = req.body;
    const user = new Users({ fullname, username, email, password, role });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "failed to register user" });
  }
};

export { registerUser, getUserProfile };
