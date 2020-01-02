const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.getAllTransaction = async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(404).json({ message: "Only admin can access " });

    let transactions = await Transaction.find()
      .populate("user")
      .sort("-createdAt");
    let products = await Product.find();

    if (!transactions)
      res.status(200).json({ message: "No transactions available" });

    for (let i = 0; i < transactions.length; i++) {
      for (let y = 0; y < transactions[i].products.length; y++) {
        for (let z = 0; z < products.length; z++) {
          let trnsProId = `${transactions[i].products[y]._id}`;
          let productId = `${products[z]._id}`;

          if (productId == trnsProId) {
            let data = {
              _id: transactions[i].products[y]._id,
              quantity: transactions[i].products[y].quantity,
              code: products[z].code,
              name: products[z].name,
              price: products[z].price,
              image: products[z].image,
              color: products[z].color,
              stock: products[z].stock,
              material: products[z].material,
              width: products[z].width,
              description: products[z].description,
              status: products[z].status
            };
            transactions[i].products[y] = data;
          }
        }
      }
    }

    res.status(200).json({ message: "Success", data: transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.isAdmin)
      return res.status(404).json({ message: "Only user can access " });

    let transactions = await Transaction.find({ user: userId })
      .populate("user")
      .sort("-createdAt");
    let products = await Product.find();

    if (!transactions)
      res.status(200).json({ message: "No transactions available" });

    for (let i = 0; i < transactions.length; i++) {
      for (let y = 0; y < transactions[i].products.length; y++) {
        for (let z = 0; z < products.length; z++) {
          let trnsProId = `${transactions[i].products[y]._id}`;
          let productId = `${products[z]._id}`;

          if (productId == trnsProId) {
            let data = {
              _id: transactions[i].products[y]._id,
              quantity: transactions[i].products[y].quantity,
              code: products[z].code,
              name: products[z].name,
              price: products[z].price,
              image: products[z].image,
              color: products[z].color,
              stock: products[z].stock,
              material: products[z].material,
              width: products[z].width,
              description: products[z].description,
              status: products[z].status
            };
            transactions[i].products[y] = data;
          }
        }
      }
    }

    res.status(200).json({ message: "Success", data: transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    let transactions = await Transaction.findById(id)
      .populate("user")
      .populate("product");
    let products = await Product.find();

    if (!transactions)
      res.status(400).json({ message: "No transaction with the given id" });

    for (let y = 0; y < transactions.products.length; y++) {
      for (let z = 0; z < products.length; z++) {
        let trnsProId = `${transactions.products[y]._id}`;
        let productId = `${products[z]._id}`;

        if (productId == trnsProId) {
          let data = {
            _id: transactions.products[y]._id,
            quantity: transactions.products[y].quantity,
            code: products[z].code,
            name: products[z].name,
            price: products[z].price,
            image: products[z].image,
            color: products[z].color,
            stock: products[z].stock,
            material: products[z].material,
            width: products[z].width,
            description: products[z].description,
            status: products[z].status
          };
          transactions.products[y] = data;
        }
      }
    }

    res.status(200).json({ message: "Success", data: transactions });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    if (req.isAdmin)
      return res.status(404).json({ message: "Only user can access " });
    const userId = req.userId;

    const { shippingAddress, paymentMethod, courService } = req.body;
    let total = 0;
    const userCart = await Cart.findOne({ user: userId });
    let products = await Product.find();

    if (!userCart.products.length)
      return res.status(500).json({ message: "Product in cart is empty" });

    for (let i = 0; i < userCart.products.length; i++) {
      for (let y = 0; y < products.length; y++) {
        let cartId = `${userCart.products[i]._id}`;
        let productId = `${products[y]._id}`;

        if (productId == cartId) {
          let data = {
            _id: userCart.products[i]._id,
            quantity: userCart.products[i].quantity,
            code: products[y].code,
            name: products[y].name,
            price: products[y].price,
            image: products[y].image,
            color: products[y].color,
            stock: products[y].stock,
            material: products[y].material,
            width: products[y].width,
            description: products[y].description,
            status: products[y].status
          };
          userCart.products[i] = data;
        }
      }
    }

    for (let i = 0; i < userCart.products.length; i++) {
      total += userCart.products[i].price;
    }

    total += courService.cost;

    let data = {
      products: userCart.products,
      shippingAddress: shippingAddress,
      processStatus: "Menunggu konfirmasi",
      payments: {
        isPaidOff: false,
        method: paymentMethod
      },
      courService: courService,
      user: userId,
      total: total
    };

    const transaction = await Transaction.create(data);

    res.status(200).json({ message: "Success", data: transaction });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", err });
  }
};

exports.statusTransaction = async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(404).json({ message: "Only admin can access " });

    const { id } = req.params;
    const { status } = req.body;
    const transaction = await Transaction.findById(id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    transaction.processStatus = status;

    await transaction.save();

    res
      .status(200)
      .json({ message: `Transaksi status ${status}`, status: status });
  } catch (err) {
    res.json({ err: err.message });
  }
};

exports.arrive = async (req, res) => {
  try {
    if (req.isAdmin)
      return res.status(404).json({ message: "Only user can access " });

    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    transaction.processStatus = "Sampai";

    const savedTrans = await transaction.save();

    res.status(200).json({ message: `Transaksi Diterima`, data: savedTrans });
  } catch (err) {
    res.json({ err: err.message });
  }
};

exports.resiTransaction = async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(404).json({ message: "Only admin can access " });

    const { id } = req.params;
    const { number } = req.body;

    const transaction = await Transaction.findById(id);

    transaction.processStatus = "Dikirim";
    transaction.resiNumber = number;

    const newTrans = await transaction.save();

    res.status(200).json({ message: `Transaksi Resi Updated`, data: newTrans });
  } catch (err) {
    res.json({ err: err.message });
  }
};
