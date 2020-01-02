const User = require("../models/User");

exports.getAllUser = (req, res) => {
  User.find()
    .then(users => {
      if (!users) res.status(404).json({ message: "No users available" });

      res.status(200).json({ message: "Success", data: users });
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(422).json({ message: "Invalid Format" });

    const user = await User.findOne({ _id: userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Success",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const { userId } = req.params;

    if (!firstName || !lastName || !userId)
      throw new Error("Struktur data salah");

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName },
      { new: true }
    );

    res.status(200).json({ message: "Success Update", data: updatedUser });
  } catch (err) {
    res.json({ err: err.message });
  }
};
