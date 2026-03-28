const express = require('express');
const router = express.Router();

const { guestCheckout } = require('../controllers/checkoutController');

router.post('/guest', guestCheckout);

module.exports = router;
