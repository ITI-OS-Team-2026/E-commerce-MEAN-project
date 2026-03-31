const APIError = require('../utils/APIError');
const User = require('../models/User');
const { createJWT } = require('../utils/jwt');
const createTokenUser = require('../utils/createTokenUser');
const crypto = require('crypto');
const emailService = require('../services/emailService'); // ✅ correct import

const register = async (userData) => {
  const { email, name, password, phone, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new APIError('Email already in use', 400);

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

  // 👈 2. Send the verification email using your existing service
  await emailService.sendEmail({
    to: user.email,
    subject: 'Verify your email',
    template: 'verifyEmail.html',
    variables: {
      name: user.name,
      verificationUrl: `${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`,
    },
  });

  return {
    message:
      user.role === 'seller'
        ? 'Registration successful. Please verify your email. After verification, your account will be reviewed by an admin.'
        : 'Registration successful. Please check your email to verify your account.',
  };
};

// 👈 3. Add verifyEmail function
const verifyEmail = async ({ token }) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) throw new APIError('Invalid or expired verification token', 400);

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  return {
    message:
      user.role === 'seller'
        ? 'Email verified. Your account is pending admin approval.'
        : 'Email verified successfully. You can now log in.',
  };
};

const login = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) throw new APIError('Invalid email or password', 401);

  if (!user.isActive) throw new APIError('Your account has been deactivated', 403);

  if (!user.isVerified) throw new APIError('Please verify your email before logging in.', 403);

  if (user.role === 'seller' && !user.isApproved)
    throw new APIError('Your seller account is pending admin approval.', 403);

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) throw new APIError('Invalid email or password', 401);

  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  return { tokenUser, token };
};

const logout = () => {
  return 'User logged out successfully';
};

module.exports = { register, verifyEmail, login, logout };
