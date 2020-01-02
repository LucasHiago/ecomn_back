const express = require("express");
const router = express.Router();

const { getUserAddress, updateUserAddress } = require("../controllers/address");

const { checkAuth } = require("../middlewares/authentication");

router.get("/:userId", checkAuth, getUserAddress);
router.put("/:userId", checkAuth, updateUserAddress);

module.exports = router;
