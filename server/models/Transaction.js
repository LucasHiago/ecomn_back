const mongoose = require("mongoose");
const Product = require("./Product");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],

  total: {
    type: Number,
    required: true,
    default: 0
  },
  // 1.Menunggu pembayaran, 2.Menunggu konfirmasi admin, 3. Pesanan Dikirim, 4.Pesanan diterima
  // 5. Pesanan ditolak,
  processStatus: {
    type: String,
    required: true
  },

  resiNumber: {
    type: String
  },

  payments: {
    isPaidOff: {
      type: Boolean,
      required: true,
      default: false
    },
    method: {
      type: String,
      required: true
    },
    rekNumber: {
      type: Number
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    image: {
      type: String
    },
    verify: {
      type: String
    },
    paymentDate: {
      type: Date,
      required: false
    }
  },

  courService: {
    courier: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      require: true
    },
    etd: {
      type: String,
      required: true
    },
    note: {
      type: String,
      require: false
    }
  },

  shippingAddress: {
    phoneNumber: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  // Relation with Users
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// Reduce Product Quantity
transactionSchema.post("save", async doc => {
  try {
    // Loop though products in transactions
    // to reduce stock
    const products = doc.products;
    for (let i = 0; products.length; i++) {
      let product = await Product.findById(products[i]._id);
      product.stock = product.stock - products[i].quantity;
      product.save();
    }

    // Clear cart data
    const cart = await Cart.findOne({ user: doc.user });

    cart.products = [];

    cart.save();
  } catch (error) {
    return;
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
