const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.isAdmin)
      return res.status(404).json({ message: "Only konsumen can access " });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) throw new Error("Invalid User Id");

    let products = await Product.find();

    for (let i = 0; i < cart.products.length; i++) {
      for (let y = 0; y < products.length; y++) {
        let cartId = `${cart.products[i]._id}`;
        let productId = `${products[y]._id}`;

        if (productId == cartId) {
          let data = {
            _id: cart.products[i]._id,
            quantity: cart.products[i].quantity,
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
          cart.products[i] = data;
        }
      }
    }

    res.status(200).json({ message: "Success", data: cart });
  } catch (err) {
    res.json({ err: err.message });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    if (req.isAdmin)
      return res.status(404).json({ message: "Only konsumen can access " });

    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
      return res.status(200).json({ message: "Format data salah" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) res.status(200).json({ message: "Invalid User Id" });
    let isProductInCart = false;

    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i]._id == productId) {
        cart.products[i].quantity = cart.products[i].quantity + quantity;
        isProductInCart = true;
        break;
      }
    }

    if (isProductInCart) {
      const savedCart = await cart.save();
      return res.status(200).json({ message: "Success", data: savedCart });
    } else {
      cart.products.push({ _id: productId, quantity: quantity });
      const savedCart = await cart.save();
      return res.status(200).json({ message: "Success", data: savedCart });
    }
  } catch (err) {
    return res.json({ err: err.message });
  }
};

exports.setQuantity = async (req, res) => {
  try {
    // if (req.isAdmin)
    //   return res.status(404).json({ message: "Only konsumen can access " });

    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId) throw new Error("Format parameter salah");

    const cart = await Cart.findOne({ user: userId });

    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i]._id == itemId) {
        cart.products[i].quantity = quantity;
        break;
      }
    }

    const savedCart = await cart.save();
    res.status(200).json({ message: "Success", data: savedCart });
  } catch (err) {
    res.json({ err });
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    if (req.isAdmin)
      return res.status(404).json({ message: "Only konsumen can access " });

    const { userId, itemId } = req.params;

    if (!userId || !itemId) throw new Error("Format parameter salah");

    const cart = await Cart.findOne({ user: userId });

    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i]._id == itemId) {
        cart.products.splice(i, 1);
        break;
      }
    }

    const savedCart = await cart.save();
    res.status(200).json({ message: "Success", data: savedCart });
  } catch (err) {
    res.json({ err: err.message });
  }
};
