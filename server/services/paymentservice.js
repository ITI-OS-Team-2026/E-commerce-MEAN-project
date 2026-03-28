const Stripe = require('stripe');
const Payment = require('../models/payment.js');

exports.createPaymentIntent = async ({ amount, currency, userId, orderId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency || 'usd',
  });

  const payment = await Payment.create({
    userId,
    orderId,
    amount,
    currency,
    status: 'pending',
    stripePaymentIntentId: paymentIntent.id,
  });

  return { clientSecret: paymentIntent.client_secret, payment };
};

exports.confirmPayment = async (paymentIntentId) => {
  return await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntentId },
    { status: 'succeeded' },
    { new: true }
  );
};