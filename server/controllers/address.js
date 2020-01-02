const Address = require("../models/Address");

exports.getUserAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const accessTokenUserId = req.userId;

    // Check if given user id has access to the data
    if (userId !== `${accessTokenUserId}`)
      return res.status(403).json({ message: "Forbidden" });

    const address = await Address.findOne({ user: userId });

    if (!address)
      return res
        .status(404)
        .json({ message: "Address with the given user id not found" });

    res.status(200).json({ message: "Success", data: address });
  } catch (error) {
    res.json({ error });
  }
};

exports.updateUserAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const accessTokenUserId = req.userId;

    // Check if given user id has access to the data
    if (userId !== `${accessTokenUserId}`)
      return res.status(403).json({ message: "Forbidden" });

    const { phoneNumber, province, city, address } = req.body;

    const updatedAddress = await Address.findOneAndUpdate(
      { user: userId },
      {
        phoneNumber: phoneNumber,
        province: province,
        city: city,
        address: address
      },
      { new: true }
    );

    res.status(200).json({ message: "Success Update", data: updatedAddress });
  } catch (error) {
    res.json({ err: err.message });
  }
};
