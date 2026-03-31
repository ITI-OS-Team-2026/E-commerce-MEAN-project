const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const schemas = require('../schemas/User');
const { register, verifyEmail, login, logout } = require('../controllers/authController');

router.post('/register', validate(schemas.createUserSchema), register);
router.get('/verify-email', verifyEmail); // called when user clicks the link in email
router.post('/login', validate(schemas.loginSchema), login);
router.get('/logout', logout);

module.exports = router;
