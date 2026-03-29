const checkoutService = require('../services/checkoutService');
const APIError = require('../utils/APIError');

const checkout = async (req, res, next) => {
  try {
    if (!req.body || !req.body.shippingAddress || !req.body.paymentMethod) {
      throw new APIError('Shipping address and payment method are required', 400);
    }

    const userId = req.user.userId;
    const { shippingAddress, paymentMethod, paymentIntentId } = req.body;
    const order = await checkoutService.checkout(
      userId,
      shippingAddress,
      paymentMethod,
      paymentIntentId,
    );
    res.status(201).json({ status: 'success', data: order });
  } catch (err) {
    next(err);
  }
};

const guestCheckout = async (req, res, next) => {
  try {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.shippingAddress ||
      !req.body.items
    ) {
      throw new APIError('Name, email, shipping address, and items are required', 400);
    }

    const { name, email, shippingAddress, items } = req.body;
    const order = await checkoutService.guestCheckout(name, email, shippingAddress, items);
    res.status(201).json({ status: 'success', data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { checkout, guestCheckout };
