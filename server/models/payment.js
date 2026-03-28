const mongoose = require('mongoose');
const paymentSchema = require("../schemas/payment/payment.schema.js");


const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;