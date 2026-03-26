const orderService = require('../services/orderService');

const placeOrder = async (req, res) => {
  const order = await orderService.placeOrder(req);
  return res.status(201).json({ order });
};

const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req);
  return res.status(200).json({ order });
};

const getMyOrders = async (req, res) => {
  const orders = await orderService.getMyOrders(req);
  return res.status(200).json({ results: orders.length, orders });
};

const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateOrderStatus(req);
  return res.status(200).json({ order });
};

module.exports = {
  placeOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
};
