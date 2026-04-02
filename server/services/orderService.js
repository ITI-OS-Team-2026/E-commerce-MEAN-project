const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const APIError = require('../utils/APIError');
const { showCurrentUser } = require('./userServices');
const emailService = require('../services/emailService'); // ✅ correct import

const placeOrder = async (req) => {
  const user = showCurrentUser(req);
  if (!user) throw new APIError('Authentication required', 401);

  const { items, shippingAddress } = req.body;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new APIError(`Product not found with ID: ${item.product}`, 404);
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: user.userId,
    items,
    shippingAddress,
    totalAmount,
    status: 'pending',
    trackingHistory: [{ status: 'pending', comment: 'Order created' }],
  });

  const currentUser = await User.findById(user.userId);
  if (!currentUser) throw new APIError('User not found', 404);

  try {
    await emailService.sendEmail({
      to: currentUser.email,
      subject: `Order Confirmation - Order #${order._id}`,
      template: 'orderPlaced.html',
      variables: {
        userName: currentUser.name,
        userEmail: currentUser.email,
        orderId: order._id,
        totalAmount: order.totalAmount,
        itemsCount: order.items.length,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    });
  } catch (emailError) {
    console.error('EMAIL ERROR:', emailError);
    throw new APIError(emailError.message || 'Failed to send email', 500);
  }

  return order;
};

const getOrderById = async (req) => {
  const user = showCurrentUser(req);
  if (!user) throw new APIError('Authentication required', 401);

  const order = await Order.findById(req.params.id).populate('items.product', 'name price');

  if (!order) {
    throw new APIError(`Order not found with ID: ${req.params.id}`, 404);
  }

  if (user.role === 'customer' && order.user.toString() !== user.userId) {
    throw new APIError('Not authorized to access this order', 403);
  }

  return order;
};

const getMyOrders = async (req) => {
  const user = showCurrentUser(req);
  if (!user) throw new APIError('Authentication required', 401);

  const orders = await Order.find({ user: user.userId }).populate('items.product', 'name price');

  return orders;
};

const getAllOrders = async (req) => {
  const user = showCurrentUser(req);
  if (!user) throw new APIError('Authentication required', 401);

  const orders = await Order.find()
    .populate('items.product', 'name price')
    .populate('user', 'name email');

  return orders;
};

const updateOrderStatus = async (req) => {
  const user = showCurrentUser(req);
  if (!user) throw new APIError('Authentication required', 401);

  if (!['admin', 'seller', 'customer'].includes(user.role)) {
    throw new APIError('Not authorized to update order status', 403);
  }

  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new APIError(`Order not found with ID: ${req.params.id}`, 404);
  }

  order.status = status;
  order.trackingHistory.push({
    status,
    comment: `Status changed to ${status}`,
  });

  await order.save();

  // ✅ Send status update email (optional but recommended)
  const userData = await User.findById(order.user);

  if (userData) {
    try {
      await emailService.sendEmail({
        to: userData.email,
        subject: `Order Status Updated - #${order._id}`,
        template: 'orderStatus.html', // create this template
        variables: {
          userName: userData.name,
          orderId: order._id,
          status: order.status,
        },
      });
    } catch (err) {
      console.error('EMAIL ERROR:', err);
      // don't block the request for email failure
    }
  }

  return order;
};

module.exports = {
  placeOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
