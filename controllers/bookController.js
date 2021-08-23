const Book = require('./../models/bookModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('./../utils/appError');

exports.aliasTopBooks = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,authors,description';
    next();
}

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, { path: 'reviews' });
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);

// exports.deleteBook = catchAsync(async (req, res, next) => {
//     const book = await Book.findByIdAndDelete(req.params.id);

//     if (!book) {
//         return next(new AppError('No Book Found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

exports.getBookStats = catchAsync(async (req, res, next) => {
    const stats = await Book.aggregate([
        {
            $unwind: '$categories'
        },
        {
            $group: {
                _id: '$categories',
                numBooks: { $sum: 1},
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                books: { $push: '$title' }   
            }
        },
        {
            $sort: { numBooks: -1}
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Book.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                numBooksAdded: { $sum: 1 },
                books: { $push: '$title' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numBooksAdded: -1 }
        },
        {
            $limit: 12
        }
    ]);
    
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});
