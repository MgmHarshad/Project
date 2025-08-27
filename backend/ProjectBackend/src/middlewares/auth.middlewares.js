import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET_KEY;

const setUser = (user) => {
  return jwt.sign({id: user._id, role: user.role, email: user.email}, secret, {expiresIn: "1d"});
};

const getUser = (token) => {
  try {
    return jwt.verify(token, secret);
  }catch (error) {
    console.error("JWT verification error:", error.message);
    return null;
}
};

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = getUser(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    // Role check (optional)
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded; // Attach user info to request
    next();
  };
}

export { setUser, getUser, authMiddleware };