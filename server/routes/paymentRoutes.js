const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');
const authenticate = require('../middlewares/authenticate');

router.post('/create-intent', authenticate, paymentController.createPaymentIntent);
router.post('/confirm', authenticate, paymentController.confirmPayment);

module.exports = router;