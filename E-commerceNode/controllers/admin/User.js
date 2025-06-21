const asyncHandler = require("express-async-handler");
const { User } = require("../../models/User");

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({type:'user'});
  res.json(users);
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});

module.exports = { getAllUsers, deleteUser };
