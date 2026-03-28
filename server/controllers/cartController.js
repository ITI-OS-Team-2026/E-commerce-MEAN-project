const cartService = require('../services/cartService');
const APIError = require('../utils/APIError');

const addToCart = async (req, res, next) => {
  try {
    if (!req.body || !req.body.productId || !req.body.quantity) {
      throw new APIError('Product ID and quantity are required', 400);
    }

    const { productId, quantity } = req.body;
    const userId = req.user.userId;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json({ status: 'success', data: cart });
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;
    const cart = await cartService.removeFromCart(userId, productId);
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    next(err);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    if (!req.body || !req.body.quantity) {
      throw new APIError('Quantity is required', 400);
    }

    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;
    const cart = await cartService.updateQuantity(userId, productId, quantity);
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    next(err);
  }
};

module.exports = { addToCart, removeFromCart, updateQuantity };
