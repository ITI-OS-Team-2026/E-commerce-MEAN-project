const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

const { addToCart, removeFromCart } = require('../controllers/cartController');

router.post('/', authenticate, addToCart);
router.delete('/:productId', authenticate, removeFromCart);

module.exports = router;
