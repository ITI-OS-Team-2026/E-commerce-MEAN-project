const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

const {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
} = require('../controllers/cartController');

router.post('/', authenticate, addToCart);
router.delete('/:productId', authenticate, removeFromCart);
router.patch('/:productId', authenticate, updateQuantity);
router.get('/', authenticate, getCart);

module.exports = router;
