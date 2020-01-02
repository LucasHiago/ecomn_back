const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication");
const validation = require("../middlewares/validation");
const schemas = require("../middlewares/schemas");

const { login, register } = require("../controllers/userAuth");
const { getAllUser, getUser, updateUser } = require("../controllers/users");

// Prefix : users
router.put("/login", validation(schemas.login), login);
router.post("/register", validation(schemas.register), register);

router.get("/:userId", getUser);
router.put("/:userId", updateUser);

router.get("/", checkAuth, getAllUser);

module.exports = router;
