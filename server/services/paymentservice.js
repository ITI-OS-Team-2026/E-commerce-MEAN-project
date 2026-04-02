const Stripe = require('stripe');
const Payment = require('../models/payment.js');

const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error('Stripe secret key is not configured');
  }

  return new Stripe(secretKey);
};

exports.createPaymentIntent = async ({ amount, currency, userId, orderId }) => {
  const stripe = getStripeClient();

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

exports.createCheckoutSession = async ({ amount, currency, userId, successUrl, cancelUrl }) => {
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: 'E-commerce order payment',
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: String(userId),
    },
  });

  await Payment.create({
    userId,
    amount,
    currency: currency || 'usd',
    status: 'pending',
    stripeCheckoutSessionId: session.id,
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
};

exports.verifyCheckoutSession = async (sessionId) => {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });

  if (session.payment_status !== 'paid') {
    return {
      paid: false,
      status: session.payment_status,
    };
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

  await Payment.findOneAndUpdate(
    { stripeCheckoutSessionId: session.id },
    {
      status: 'succeeded',
      stripePaymentIntentId: paymentIntentId,
    },
    { new: true },
  );

  return {
    paid: true,
    sessionId: session.id,
    paymentIntentId,
  };
};

exports.confirmPayment = async (paymentIntentId) => {
  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    return null;
  }

  return await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntentId },
    { status: 'succeeded' },
    { new: true }
  );
};