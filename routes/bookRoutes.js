const express = require('express');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', bookController.checkID);

router.use('/:bookId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(bookController.aliasTopBooks, bookController.getAllBooks);

router.route('/book-stats').get(bookController.getBookStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'librarian'),
        bookController.getMonthlyPlan
    );

router
    .route('/')
    .get(bookController.getAllBooks)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'librarian'),
        bookController.createBook
    );

router
    .route('/:id')
    .get(bookController.getBook)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'librarian'),
        bookController.updateBook
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'librarian'),
        bookController.deleteBook
    );


module.exports = router;