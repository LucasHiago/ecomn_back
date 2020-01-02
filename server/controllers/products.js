const Product = require("../models/Product");
const path = require("path");
const Resize = require("../utils/Resize");
const fs = require("fs");

/**
 * @route   GET /products
 * @desc    return all product
 */
exports.getAll = (req, res) => {
  Product.find()
    .sort("-created_at")
    .then(products => {
      if (!products) res.status(200).json({ message: "No products available" });

      res.status(200).json({ message: "Success", data: products });
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

/**
 * @route   GET /products/:id
 * @desc    Get product by id
 */
exports.get = (req, res) => {
  const id = req.params.id;
  Product.findOne({ _id: id })
    .then(product => {
      if (!product)
        res.status(400).json({ message: "No Product with the given id" });

      res.status(200).json({ message: "Success", data: product });
    })
    .catch(err => {
      res.status(500).json({ err: err.message });
    });
};

/**
 * @route   POST /products
 * @desc    Create a new product
 */
exports.create = async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(404).json({ message: "Only admin can access " });

    let data = ({
      code,
      name,
      price,
      material,
      width,
      description,
      image,
      stock,
      color
    } = req.body);
    const imagePath = path.join(__dirname, "../../public/images");

    const fileUpload = new Resize(imagePath);
    if (!req.file) res.status(401).json({ error: "Please provide an image" });

    const filename = await fileUpload.save(req.file.buffer);

    data.image = filename;

    const product = await Product.create(data);

    return res.status(201).json({ message: "Success", data: product });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ err: err.message });
    return res.status(500).json({ err: err.message });
  }
};

/**
 * @route   PUT /products
 * @desc    Update a product
 */
exports.update = async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(404).json({ message: "Only admin can access " });

    const { id } = req.params;
    const data = req.body;

    const product = await Product.findOneAndUpdate({ _id: id }, data, {
      new: true
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Success", data: product });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @route   DELETE /products
 * @desc    Delete a product
 */
exports.deleteProduct = async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(404).json({ message: "Only admin can access " });
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new Error("Product with the given id not found");
    const deleted = await Product.deleteOne({ _id: id });

    imagePath = path.join(__dirname, `../../public/images/${product.image}`);

    fs.unlink(imagePath, function(err) {
      if (err) return false;
    });

    res
      .status(200)
      .json({ message: "Success", delete: deleted, data: product });
  } catch (error) {
    res.status(500).json({ error });
  }
};
