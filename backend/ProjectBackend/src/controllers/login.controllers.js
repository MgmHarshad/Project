import Users from "../models/users.models.js";
import { setUser } from "../middlewares/auth.middlewares.js";

const loginUsers = async (req, res) => {
  let { email, password} = req.body;

  const user = await Users.findOne({ email, password});

  if (!user) {
    res.status(401).json({ error: "Invalid Credentilas" });
  }

  const token = setUser({ _id: user._id, email: user.email});
  console.log("Generated Token:", token); // debug
  res.cookie("uid", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  return res.json({
    message: "Profile data",
    user,
    token
  });
};
export { loginUsers };
