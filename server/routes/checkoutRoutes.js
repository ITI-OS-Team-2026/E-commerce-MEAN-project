const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

const { checkout, guestCheckout } = require('../controllers/checkoutController');

router.post('/', authenticate, checkout);
router.post('/guest', guestCheckout);

module.exports = router;
