const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const JWT_SECRET = config.get("JWT_SECRET");

signUserToken = user => {
  return jwt.sign(
    {
      iss: "Fabrik store E-Commerce",
      sub: user._id,
      iat: new Date().getTime(), // Current Time
      exp: new Date().setDate(new Date().getDate() + 1), // Current Time + 1 day
      admin: false
    },
    JWT_SECRET
  );
};

/**
 * @route   POST /users/login
 * @desc    User Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(403).json({ message: "Password does not match" });

    const token = signUserToken(user);

    return res.status(200).json({
      userId: user._id,
      access_token: token,
      token_type: "bearer"
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * @route   POST /users/register
 * @desc    Register a user
 */
exports.register = async (req, res) => {
  try {
    let { firstName, lastName, email, address, password } = req.body;

    // Check if email is exists
    const user = await User.findOne({ email: email });
    if (user)
      return res.status(409).json({
        message: "Email already in use",
        data: req.body
      });

    // All validation pass, Create User
    let newUser = new User({
      firstName,
      lastName,
      email,
      address,
      password
    });

    const savedUser = await newUser.save();

    const token = signUserToken(savedUser);

    return res.status(200).json({
      message: "Register Success",
      data: savedUser,
      access_token: token
    });
  } catch (err) {
    // If the process fail the data should be deleted in database
    res.json({ err: err.message });
  }
};
