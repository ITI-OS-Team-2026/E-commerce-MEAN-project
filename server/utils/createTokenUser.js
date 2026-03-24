const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    // only included if the user is a seller
    ...(user.role === 'seller' && { isApproved: user.isApproved }),
  };
};

module.exports = createTokenUser;
