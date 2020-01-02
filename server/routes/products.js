const express = require("express");
const router = express.Router();
const {
  get,
  getAll,
  create,
  update,
  deleteProduct
} = require("../controllers/products");
const upload = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/authentication");

// Prefix : products
router.get("/", getAll);
router.get("/:id", get);
router.post("/", checkAuth, upload.single("image"), create);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteProduct);

module.exports = router;
