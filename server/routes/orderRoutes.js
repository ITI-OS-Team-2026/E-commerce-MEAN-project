const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const restrictTo = require('../middlewares/restrictTo');
const validate = require('../middlewares/validate');
const schemas = require('../schemas/Order');

const {
  placeOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

router.post(
  '/',
  authenticate,
  restrictTo('customer'),
  validate(schemas.createOrderSchema),
  placeOrder,
);
router.get('/admin-orders', authenticate, restrictTo('admin'), getAllOrders);
router.get('/', authenticate, restrictTo('customer'), getMyOrders);
router.get('/:id', authenticate, restrictTo('admin', 'customer', 'seller'), getOrderById);
router.patch(
  '/:id',
  authenticate,
  restrictTo('admin', 'seller', 'customer'),
  validate(schemas.updateOrderStatusSchema),
  updateOrderStatus,
);

module.exports = router;
