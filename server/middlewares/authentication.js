const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const config = require("config");

const JWT_SECRET = config.get("JWT_SECRET");

exports.checkAuth = async (req, res, next) => {
  try {
    // Get Authorization header
    const bearerHeader = req.headers["authorization"];

    // Check if Authorization header is undefined
    if (typeof bearerHeader == "undefined")
      return res.status(400).json({ message: "Authorization header required" });

    // Check Authorization header format
    if (!bearerHeader.startsWith("Bearer "))
      return res
        .status(400)
        .json({ message: "Invalid Authorization header format" });

    // Check if access token is provided
    if (bearerHeader.length == 7)
      return res.status(400).json({ message: "Access token required" });

    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const isAdmin = decoded.admin;

    if (isAdmin) {
      const admin = await Admin.findById(decoded.sub);

      if (!admin)
        return res.status(400).json({
          message: "Admin not found when trying to check authentication"
        });

      req.userId = admin._id;
      req.isAdmin = true;

      next();
    } else {
      const user = await User.findById(decoded.sub);

      if (!user)
        return res.status(400).json({
          message: "User not found when trying to check authentication"
        });

      req.userId = user._id;
      req.isAdmin = false;

      next();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
