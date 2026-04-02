const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');
const authenticate = require('../middlewares/authenticate');

router.post('/create-intent', authenticate, paymentController.createPaymentIntent);
router.post('/create-checkout-session', authenticate, paymentController.createCheckoutSession);
router.post('/verify-session', authenticate, paymentController.verifyCheckoutSession);
router.post('/confirm', authenticate, paymentController.confirmPayment);

module.exports = router;