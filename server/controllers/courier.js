const axios = require("axios");
const redis = require("redis");
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

exports.getCost = (req, res) => {
  const { origin, destination, weight, courier } = req.body;

  axios
    .post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin: origin,
        destination: destination,
        weight: weight,
        courier: courier
      },
      {
        headers: {
          key: "2e15faa98e205ad0f21e1a4fb97432c4"
        }
      }
    )
    .then(result => {
      return res.status(200).json({ message: "Success", data: result.data });
    })
    .catch(err => {
      return res.status(500).json({ message: "Error", err: err });
    });
};

exports.getProvince = (req, res) => {
  axios
    .get("https://api.rajaongkir.com/starter/province", {
      headers: {
        key: "2e15faa98e205ad0f21e1a4fb97432c4"
      }
    })
    .then(result => {
      client.setex("province", 3600, JSON.stringify(result.data));
      return res.status(200).json({ message: "Success", data: result.data });
    })
    .catch(err => {
      return res.status(500).json({ message: "Error", err: err });
    });
};

exports.getCity = (req, res) => {
  axios
    .get("https://api.rajaongkir.com/starter/city", {
      headers: {
        key: "2e15faa98e205ad0f21e1a4fb97432c4"
      }
    })
    .then(result => {
      client.setex("city", 3600, JSON.stringify(result.data));
      return res.status(200).json({ message: "Success", data: result.data });
    })
    .catch(err => {
      return res.status(500).json({ message: "Error", err: err });
    });
};
