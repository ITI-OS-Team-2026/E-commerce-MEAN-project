const paymentService = require('../services/paymentservice');
const APIError = require('../utils/APIError');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency, orderId } = req.body;
    const userId = req.user?.userId;
    const result = await paymentService.createPaymentIntent({ amount, currency, userId, orderId });
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
};

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { amount, currency, successUrl, cancelUrl } = req.body;
    const userId = req.user?.userId;

    const result = await paymentService.createCheckoutSession({
      amount,
      currency,
      userId,
      successUrl,
      cancelUrl,
    });

    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
};

exports.verifyCheckoutSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const result = await paymentService.verifyCheckoutSession(sessionId);
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