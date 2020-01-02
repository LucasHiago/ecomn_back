const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  products: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Cart", cartSchema);
