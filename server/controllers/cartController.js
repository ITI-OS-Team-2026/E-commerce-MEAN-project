const cartService = require('../services/cartService');

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json({ status: 'success', data: cart });
  } catch (err) {
    next(err);
  }
};

module.exports = { addToCart };
