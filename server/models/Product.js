const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "available"
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
});

module.exports = mongoose.model("Product", productSchema);
