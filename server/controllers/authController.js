const authService = require('../services/authServices');
const APIError = require('../utils/APIError');

const register = async (req, res) => {
  // register now returns a message, not a token
  const result = await authService.register(req.body);
  return res.status(201).json(result);
};

const verifyEmail = async (req, res) => {
  const { token } = req.query; // GET /auth/verify-email?token=abc123
  if (!token) throw new APIError('Verification token is required', 400);
  const result = await authService.verifyEmail({ token });
  return res.status(200).json(result);
};

const login = async (req, res) => {
  const { tokenUser, token } = await authService.login(req.body);
  return res.status(200).json({ tokenUser, token });
};

const logout = (req, res) => {
  const message = authService.logout();
  return res.status(200).json({ message });
};

module.exports = { register, verifyEmail, login, logout };
