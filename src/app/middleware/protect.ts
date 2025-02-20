import jwt from "jsonwebtoken";
import Admin from "../Schema/Admin";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = async (req, res, next) => {
  const admin = await Admin.findById(req.user.id);
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
