const Transaction = require("../models/Transaction");
const path = require("path");
const Resize = require("../utils/Resize");

exports.uploadProof = async (req, res) => {
  try {
    if (req.isAdmin)
      return res.status(404).json({ message: "Only konsumen can access " });

    const { id } = req.params;

    const imagePath = path.join(__dirname, "../../public/images");
    const fileUpload = new Resize(imagePath);
    if (!req.file)
      return res.status(401).json({ error: "Please provide an image" });
    const filename = await fileUpload.save(req.file.buffer);

    const transaction = await Transaction.findById(id);

    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    transaction.payments.image = filename;

    const newTransaction = await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction Uploaded", data: newTransaction });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.verifyTransaction = async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(404).json({ message: "Only admin can access" });

    const { id } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findById(id);

    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    transaction.payments.verify = status;

    savedTransaction = await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction verify", data: savedTransaction });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
