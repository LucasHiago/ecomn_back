const express = require("express");
const { checkAuth } = require("../middlewares/authentication");
const {
  getCart,
  addItemToCart,
  deleteItemFromCart,
  setQuantity
} = require("../controllers/carts");

const router = express.Router();
// Prefix /api/carts

/* Get Cart Info */
router.get("/:userId", checkAuth, getCart);

/* Add A Product to Cart */
router.put("/:userId", checkAuth, addItemToCart);

/* Set Product Quantity in Cart */
router.put("/:userId/items/:itemId/quantity", setQuantity);

/* Delete item in cart */
router.delete("/:userId/items/:itemId", checkAuth, deleteItemFromCart);

module.exports = router;
