const Review = require('../models/Review');
const Product = require('../models/Product');
const APIError = require('../utils/APIError');
const throwIfNotFound = require('../utils/throwIfNotFound');

const setProductUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.userId;
  next();
};

const calcAverageRatings = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    await calcAverageRatings(review.product);

    res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

const getReviewsForProduct = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name'
      });

    const totalCount = await Review.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: 'success',
      totalCount,
      totalPages,
      currentPage: page,
      results: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate({
      path: 'user',
      select: 'name'
    }).populate({
      path: 'product',
      select: 'name'
    });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: 'user',
      select: 'name'
    });
    throwIfNotFound(review, 'Review not found');

    res.status(200).json({
      status: 'success',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    throwIfNotFound(review, 'Review not found');

    if (review.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return next(new APIError('Forbidden: You can only update your own review', 403));
    }

    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.comment) review.comment = req.body.comment;

    await review.save();
    await calcAverageRatings(review.product);

    res.status(200).json({
      status: 'success',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    throwIfNotFound(review, 'Review not found');

    if (review.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return next(new APIError('Forbidden: You can only delete your own review', 403));
    }

    await review.deleteOne();
    await calcAverageRatings(review.product);

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  setProductUserIds,
  calcAverageRatings,
  createReview,
  getReviewsForProduct,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
};
