const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash Password
adminSchema.pre("save", async function(next) {
  try {
    // Generate Salt
    const salt = await bcrypt.genSalt(10);
    // Generate Password Hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.password, salt);
    // Set this.password
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Admin", adminSchema);
