const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

const { addToCart, removeFromCart, updateQuantity } = require('../controllers/cartController');

router.post('/', authenticate, addToCart);
router.delete('/:productId', authenticate, removeFromCart);
router.patch('/:productId', authenticate, updateQuantity);

module.exports = router;
