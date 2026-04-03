const express = require('express');
const {
  setProductUserIds,
  createReview,
  getReviewsForProduct,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const authenticate = require('../middlewares/authenticate');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  if (req.params.productId) {
    return getReviewsForProduct(req, res, next);
  } else {
    // Enforce authentication & admin manually for global /api/v1/reviews
    authenticate(req, res, (err) => {
      if (err) return next(err);
      restrictTo('admin')(req, res, (err2) => {
        if (err2) return next(err2);
        getAllReviews(req, res, next);
      });
    });
  }
});

router.post(
  '/',
  authenticate,
  restrictTo('customer', 'seller', 'admin'),
  setProductUserIds,
  createReview
);

router.get('/:id', getReviewById);

router.patch(
  '/:id',
  authenticate,
  restrictTo('customer', 'seller', 'admin'),
  updateReview
);

router.delete(
  '/:id',
  authenticate,
  restrictTo('customer', 'seller', 'admin'),
  deleteReview
);

module.exports = router;
