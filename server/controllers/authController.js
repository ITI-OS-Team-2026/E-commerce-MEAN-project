const authService = require('../services/authServices');

const register = async (req, res) => {
  const { tokenUser, token } = await authService.register(req.body);
  return res.status(201).json({ tokenUser, token });
};

const login = async (req, res) => {
  const { tokenUser, token } = await authService.login(req.body);
  return res.status(200).json({ tokenUser, token });
};

const logout = (req, res) => {
  const message = authService.logout();
  return res.status(200).json({ message });
};

module.exports = { register, login, logout };
