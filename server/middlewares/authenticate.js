const APIError = require('../utils/APIError');
const { isTokenValid } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  const tokenData = req.headers.authorization;
  if (!tokenData) {
    throw new APIError('Authentication token is required', 401);
  }
  const token = tokenData.split(' ')[1];

  if (!token) {
    throw new APIError('Invalid token format', 401);
  }

  const payload = isTokenValid({ token });
  req.user = {
    name: payload.name,
    userId: payload.userId,
    role: payload.role,
    isVerified: payload.isVerified,
  };

  next();
};

module.exports = authenticate;
