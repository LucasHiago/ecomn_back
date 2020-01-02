const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication");
const {
  getAllTransaction,
  getUserTransactions,
  getSingleTransaction,
  createTransaction,
  statusTransaction,
  arrive,
  resiTransaction
} = require("../controllers/transactions");
const { uploadProof, verifyTransaction } = require("../controllers/payments");
const upload = require("../middlewares/upload");

//api/transactions/
/* Get All Transaction */
router.get("/", checkAuth, getAllTransaction);

/* Get All Transaction for spesific User */
router.get("/user/:userId", checkAuth, getUserTransactions);

/* Get Single Transaction */
router.get("/:id", checkAuth, getSingleTransaction);

/* Create Transaction / Checkout */
router.post("/", checkAuth, createTransaction);

/* Update Resi Transaction */
router.put("/:id/resi", checkAuth, resiTransaction);

/* Upload Transaction Proof */
router.put("/:id/proof", checkAuth, upload.single("image"), uploadProof);

/* Verify Trnsaction proof */
router.put("/:id/verify", checkAuth, verifyTransaction);

/* Change Transaction Status */
router.put("/:id/status", checkAuth, statusTransaction);

/* The Order has Arrive */
router.put("/:id/arrive", checkAuth, arrive);

module.exports = router;
