const User = require('../models/User');
const APIError = require('../utils/APIError');
const createTokenUser = require('../utils/createTokenUser');
const { createJWT } = require('../utils/jwt');
const checkPermissions = require('../utils/checkPermissions');
const emailService = require('../services/emailService'); // ✅ correct import

// ── Admin ──────────────────────────────────────────────────

const getAllUsers = async () => {
  return await User.find({ isActive: true }, '-password -verificationToken');
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new APIError(`No user found with ID: ${userId}`, 404);
  user.isActive = false;
  await user.save();
};

const approveSeller = async (sellerId) => {
  const seller = await User.findOne({ _id: sellerId, role: 'seller' });
  if (!seller) throw new APIError(`No seller found with ID: ${sellerId}`, 404);
  seller.isApproved = true;
  await seller.save();

  // send email to the seller to inform him that the account approved
  await emailService.sendEmail({
    to: seller.email,
    subject: 'Your seller account has been approved',
    template: 'sellerApproved.html',
    variables: {
      name: seller.name,
      loginUrl: `${process.env.CLIENT_URL}/auth/login`,
    },
  });
};

// ── Any authenticated user ─────────────────────────────────

const getSingleUser = async (req) => {
  const user = await User.findOne(
    { _id: req.params.id, isActive: true },
    '-password -verificationToken',
  );
  if (!user) throw new APIError(`No user found with ID: ${req.params.id}`, 404);
  checkPermissions(req.user, user._id);
  return user;
};

const showCurrentUser = async (req) => {
  const user = await User.findOne(
    { _id: req.user.userId, isActive: true },
    '-password -verificationToken',
  );
  if (!user) throw new APIError('User not found', 404);
  return user;
};

const updateUser = async (userId, userData) => {
  const { name, email, phone, address, storeName } = userData;

  const updatePayload = {};
  if (name !== undefined) updatePayload.name = name;
  if (email !== undefined) updatePayload.email = email;
  if (phone !== undefined) updatePayload.phone = phone;
  if (address !== undefined) updatePayload.address = address;
  if (storeName !== undefined) updatePayload.storeName = storeName;

  const user = await User.findByIdAndUpdate(
    userId,
    updatePayload,
    { new: true, runValidators: true },
  );
  if (!user) throw new APIError('User not found', 404);

  const updatedUser = createTokenUser(user);
  const token = createJWT({ payload: updatedUser });
  return { updatedUser, token };
};

const updateUserPassword = async (userId, userData) => {
  const { oldPassword, newPassword } = userData;

  const user = await User.findById(userId);
  if (!user) throw new APIError('User not found', 404);

  const isOldPasswordValid = await user.comparePassword(oldPassword);
  if (!isOldPasswordValid) throw new APIError('Invalid credentials', 401);

  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) throw new APIError('New password must be different', 400);

  user.password = newPassword;
  await user.save();
};

// ── Wishlist ───────────────────────────────────────────────

const addToWishlist = async (userId, productId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: productId } }, // $addToSet prevents duplicates
    { new: true },
  ).populate('wishlist', 'name price images');
  return user.wishlist;
};

const removeFromWishlist = async (userId, productId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    { new: true },
  ).populate('wishlist', 'name price images');
  return user.wishlist;
};

const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate('wishlist', 'name price images');
  if (!user) throw new APIError('User not found', 404);
  return user.wishlist;
};

module.exports = {
  getAllUsers,
  deleteUser,
  approveSeller,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
