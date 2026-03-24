const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
var hpp = require('hpp');
const { xss } = require('express-xss-sanitizer');
const { limiter } = require('./middlewares/rateLimiter');

const errorHandler = require('./middlewares/errorHandler');
const throwIfNotFound = require('./utils/throwIfNotFound');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(xss());
app.use(limiter);

// Route Mount

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);

// Handle wrong routes
app.use((req, res, next) => {
  try {
    // We don't have a "resource" for unknown routes, so pass null
    throwIfNotFound(null, `Route ${req.originalUrl} not found`);
  } catch (err) {
    next(err); // Pass error to your global error handler
  }
});

// Global error handler
app.use(errorHandler);

module.exports = app;
