const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const restrictTo = require('../middlewares/restrictTo');
const validate = require('../middlewares/validate');
const schemas = require('../schemas/User');
const {
  getAllUsers,
  deleteUser,
  approveSeller,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/userController');

// ── Admin ──────────────────────────────────────────────────
router.get('/', authenticate, restrictTo('admin'), getAllUsers);
router.delete('/:id', authenticate, restrictTo('admin'), deleteUser);

// Approve Seller
router.patch('/:id/approve', authenticate, restrictTo('admin'), approveSeller);

// ── Current user ───────────────────────────────────────────
router.get('/me', authenticate, showCurrentUser);
router.patch('/update', authenticate, validate(schemas.updateUserSchema), updateUser);
router.patch(
  '/update-password',
  authenticate,
  validate(schemas.updateUserPasswordSchema),
  updateUserPassword,
);

// ── Wishlist (customers only) ──────────────────────────────
router.get('/wishlist', authenticate, restrictTo('customer'), getWishlist);
router.post('/wishlist/:productId', authenticate, restrictTo('customer'), addToWishlist);
router.delete('/wishlist/:productId', authenticate, restrictTo('customer'), removeFromWishlist);

// ── Dynamic route LAST ─────────────────────────────────────
router.get('/:id', authenticate, restrictTo('admin', 'customer', 'seller'), getSingleUser);

module.exports = router;
