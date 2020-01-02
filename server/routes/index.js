var express = require("express");
var router = express.Router();
const { checkAuth } = require("../middlewares/authentication");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

/**
 * @route GET /protected
 * @desc  Example of protected routes
 */
router.get("/protected", checkAuth, (req, res) => {
  res.send("This is protected");
});

module.exports = router;
