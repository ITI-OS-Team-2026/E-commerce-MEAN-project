const paymentService = require('../services/paymentservice');
const APIError = require('../utils/APIError');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency, orderId } = req.body;
    // const userId = req.user._id; // from your authenticate middleware
    const userId = req.user?._id || '69c7d03de2f19e2415543c06';
    const result = await paymentService.createPaymentIntent({ amount, currency, userId, orderId });
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    const payment = await paymentService.confirmPayment(paymentIntentId);
    res.status(200).json({ status: 'success', data: payment });
  } catch (err) {
    next(err);
  }
};