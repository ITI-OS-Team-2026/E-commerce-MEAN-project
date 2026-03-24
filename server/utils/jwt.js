const jwt = require('jsonwebtoken');
const APIError = require('./APIError');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFE_TIME || '30d',
  });
  return token;
};

const isTokenValid = ({ token }) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new APIError('Invalid or expired token', 401);
  }
};

module.exports = {
  createJWT,
  isTokenValid,
};
