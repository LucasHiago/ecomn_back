const redis = require("redis");
const client = redis.createClient(6379);

exports.provinceCache = (req, res, next) => {
  client.get("province", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.status(200).json({ message: "Success", data: JSON.parse(data) });
    } else {
      next();
    }
  });
};

exports.cityCache = (req, res, next) => {
  client.get("city", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.status(200).json({ message: "Success", data: JSON.parse(data) });
    } else {
      next();
    }
  });
};
