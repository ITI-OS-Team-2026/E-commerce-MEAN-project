const userService = require('../services/userService');

// ── Admin ──────────────────────────────────────────────────

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  return res.status(200).json({ results: users.length, users });
};

const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  return res.status(200).json({ message: 'User deactivated successfully' });
};

const approveSeller = async (req, res) => {
  await userService.approveSeller(req.params.id);
  return res.status(200).json({ message: 'Seller approved successfully' });
};

// ── Any authenticated user ─────────────────────────────────

const getSingleUser = async (req, res) => {
  const user = await userService.getSingleUser(req);
  return res.status(200).json({ user });
};

const showCurrentUser = (req, res) => {
  const user = userService.showCurrentUser(req);
  return res.status(200).json({ user });
};

const updateUser = async (req, res) => {
  const { updatedUser, token } = await userService.updateUser(req.user.userId, req.body);
  return res.status(200).json({ updatedUser, token });
};

const updateUserPassword = async (req, res) => {
  await userService.updateUserPassword(req.user.userId, req.body);
  return res.status(200).json({ message: 'Password updated successfully' });
};

// ── Wishlist ───────────────────────────────────────────────

const getWishlist = async (req, res) => {
  const wishlist = await userService.getWishlist(req.user.userId);
  return res.status(200).json({ results: wishlist.length, wishlist });
};

const addToWishlist = async (req, res) => {
  const wishlist = await userService.addToWishlist(req.user.userId, req.params.productId);
  return res.status(200).json({ wishlist });
};

const removeFromWishlist = async (req, res) => {
  const wishlist = await userService.removeFromWishlist(req.user.userId, req.params.productId);
  return res.status(200).json({ wishlist });
};

module.exports = {
  getAllUsers,
  deleteUser,
  approveSeller,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
