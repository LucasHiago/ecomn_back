const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Cart = require("./Cart");
const Address = require("./Address");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  address: {
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
userSchema.pre("save", async function(next) {
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

// Create Cart Object
userSchema.post("save", async function(doc) {
  try {
    const cart = Cart.create({ user: doc._id });
    if (!cart) throw new Error("Fail while creating cart object");
    const address = Address.create({ user: doc._id });
    if (!address) throw new Error("Fail while creating address object");
  } catch (error) {
    return;
  }
});

module.exports = mongoose.model("User", userSchema);
