const Order = require('../models/Order');
const Product = require('../models/Product');
const APIError = require('../utils/APIError');

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

module.exports = { guestCheckout };
