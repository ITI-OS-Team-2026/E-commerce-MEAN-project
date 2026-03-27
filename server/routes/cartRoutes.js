const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

const { addToCart } = require('../controllers/cartController');

router.post('/', authenticate, addToCart);

module.exports = router;
