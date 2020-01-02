const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./utils/db");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to E-commerce API routes");
});

app.use("/api/", require("./routes/index"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/carts", require("./routes/carts"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/address", require("./routes/address"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/courier", require("./routes/courier"));

module.exports = app;
