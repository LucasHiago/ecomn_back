const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

const JWT_SECRET = config.get("JWT_SECRET");

signToken = user => {
  return jwt.sign(
    {
      iss: "Fabrik store E-Commerce",
      sub: user._id,
      iat: new Date().getTime(), // Current Time
      exp: new Date().setDate(new Date().getDate() + 1), // Current Time + 1 day
      admin: true
    },
    JWT_SECRET
  );
};

/**
 * @route   POST /admin/login
 * @desc    Admin Login
 */
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username: username });

    if (!admin) return res.status(404).json({ message: "Admin Not Found" });

    const valid = bcrypt.compare(password, admin.password);

    if (!valid)
      return res.status(403).json({ message: "Password does not match" });

    const token = signToken(admin);

    return res.status(200).json({
      access_token: token,
      token_type: "bearer"
    });
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @route   POST /admin/register
 * @desc    Register a user
 */
exports.registerAdmin = async (req, res) => {
  try {
    let { username, password } = req.body;

    //   Pass all validation
    const admin = await Admin.findOne({ username, password });

    if (admin)
      return res.status(400).json({
        err: "Username Exists",
        data: { username }
      });

    const newAdmin = new Admin({ username, password });
    const savedAdmin = await newAdmin.save();

    const token = signToken(savedAdmin);

    res.status(200).json({
      message: "Register Success",
      data: savedAdmin,
      access_token: token
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};
