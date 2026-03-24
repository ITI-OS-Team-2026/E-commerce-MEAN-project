const APIError = require('./APIError');

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new APIError('Not authorized to access this route', 403);
};

module.exports = checkPermissions;
