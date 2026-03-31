const APIError = require('../utils/APIError');
const User = require('../models/User');
const { createJWT } = require('../utils/jwt');
const createTokenUser = require('../utils/createTokenUser');
const crypto = require('crypto');

const register = async (userData) => {
  const { email, name, password, phone, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new APIError('Email already in use', 400);

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    email,
    name,
    password,
    phone,
    role: role || 'customer',
    verificationToken,
    isVerified: false,
  });
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  return { tokenUser, token };
};

const login = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) throw new APIError('Invalid email or password', 401);

  if (!user.isActive) throw new APIError('Your account has been deactivated', 403);

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) throw new APIError('Invalid email or password', 401);

  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  return { tokenUser, token };
};

const logout = () => {
  return 'User logged out successfully';
};

module.exports = { register, login, logout };
