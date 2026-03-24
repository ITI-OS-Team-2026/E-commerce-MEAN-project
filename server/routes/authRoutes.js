const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const schemas = require('../schemas/User');
const { register, login, logout } = require('../controllers/authController');

router.post('/register', validate(schemas.createUserSchema), register);
router.post('/login', validate(schemas.loginSchema), login);
router.get('/logout', logout);

module.exports = router;
