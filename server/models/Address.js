const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  phoneNumber: {
    type: String
  },
  province: {
    type: String
  },
  city: {
    type: String
  },
  address: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Address", addressSchema);
