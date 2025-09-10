import jwt from "jsonwebtoken";
import Users from "../models/users.models.js";

const secret = process.env.JWT_SECRET_KEY;

const setUser = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    secret,
    { expiresIn: "1d" }
  );
};

const getUser = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return null;
  }
};

// ✅ FIXED Middleware
// const authMiddleware = (roles = []) => {
//   return async (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({ message: "No token provided" });
//       }

//       const decoded = jwt.verify(token, secret);
//       if (!decoded) {
//         return res.status(401).json({ message: "Invalid token" });
//       }

//       // ✅ Await user fetch
//       const user = await Users.findById(decoded.id).select("-password");
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // ✅ Optional role check
//       if (roles.length && !roles.includes(user.role)) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       req.user = user; // attach user to request
//       next();
//     } catch (error) {
//       console.error("Auth middleware error:", error.message);
//       return res.status(401).json({ message: "Unauthorized", error: error.message });
//     }
//   };
// };

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: err.message });
  }
};

export { setUser, getUser, authMiddleware };
