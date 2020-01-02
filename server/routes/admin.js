const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validation");
const schemas = require("../middlewares/schemas");

const { registerAdmin, adminLogin } = require("../controllers/adminAuth");

// Prefix : admin
router.put("/login", validation(schemas.adminLogin), adminLogin);
router.post("/register", validation(schemas.adminRegister), registerAdmin);

module.exports = router;
