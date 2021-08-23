const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.setBookUserIds = (req, res, next) => {
    // Allow nested routes
    if(!req.body.book)  req.body.book = req.params.bookId;
    if(!req.body.user)  req.body.user = req.user._id;
    next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);