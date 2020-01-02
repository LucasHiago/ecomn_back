const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication");
const { getCost, getProvince, getCity } = require("../controllers/courier");
const { provinceCache, cityCache } = require("../middlewares/cache");

router.post("/cost", checkAuth, getCost);
router.get("/province", checkAuth, provinceCache, getProvince);
router.get("/city", checkAuth, cityCache, getCity);

module.exports = router;
