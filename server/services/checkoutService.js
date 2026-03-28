const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const APIError = require('../utils/APIError');
const cartService = require('./cartService');
const paymentService = require('./paymentservice');

const checkout = async (userId, shippingAddress, paymentMethod, paymentIntentId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new APIError('Cart is empty', 400);
  }

  if (!shippingAddress) {
    throw new APIError('Shipping address is required', 400);
  }

  if (!paymentMethod) {
    throw new APIError('Payment method is required', 400);
  }

  if (paymentMethod !== 'cash_on_delivery' && paymentMethod !== 'credit_card') {
    throw new APIError('Invalid payment method', 400);
  }

  if (paymentMethod === 'credit_card') {
    if (!paymentIntentId) {
      throw new APIError('Payment intent ID is required', 400);
    }

    const payment = await paymentService.confirmPayment(paymentIntentId);

    if (!payment || payment.status !== 'succeeded') {
      throw new APIError('Payment not confirmed', 400);
    }
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) throw new APIError(`Product not found with ID: ${item.product}`, 404);
  }

  const order = await Order.create({
    user: userId,
    items: cart.items,
    shippingAddress,
    totalAmount: cart.totalPrice,
    status: 'pending',
    paymentMethod,
    trackingHistory: [{ status: 'pending', comment: 'Order created' }],
  });

  await cartService.clearCart(userId);

  return order;
};

const guestCheckout = async (name, email, shippingAddress, items) => {
  if (!name) {
    throw new APIError('Guest name is required', 400);
  }

  if (!email) {
    throw new APIError('Guest email is required', 400);
  }

  if (!shippingAddress) {
    throw new APIError('Shipping address is required', 400);
  }

  if (!items || items.length === 0) {
    throw new APIError('Items are required', 400);
  }

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new APIError(`Product not found with ID: ${item.product}`, 404);

    if (product.stock < item.quantity) {
      throw new APIError('Insufficient stock', 400);
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    guestName: name,
    guestEmail: email,
    items,
    shippingAddress,
    totalAmount,
    status: 'pending',
    trackingHistory: [{ status: 'pending', comment: 'Order created' }],
  });

  return order;
};

module.exports = { checkout, guestCheckout };
