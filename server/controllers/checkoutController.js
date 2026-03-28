const checkoutService = require('../services/checkoutService');
const APIError = require('../utils/APIError');

const guestCheckout = async (req, res, next) => {
  try {
    if (!req.body || !req.body.name || !req.body.email || !req.body.shippingAddress || !req.body.items) {
      throw new APIError('Name, email, shipping address, and items are required', 400);
    }

    const { name, email, shippingAddress, items } = req.body;
    const order = await checkoutService.guestCheckout(name, email, shippingAddress, items);
    res.status(201).json({ status: 'success', data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { guestCheckout };
