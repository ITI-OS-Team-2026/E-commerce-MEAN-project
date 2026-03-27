const orderService = require('../services/orderService');

const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req);
    return res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req);
    return res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req);
    return res.status(200).json({ results: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req);
    return res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
};
