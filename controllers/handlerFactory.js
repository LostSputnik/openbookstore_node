const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


exports.deleteOne = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

exports.updateOne = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError('No document Found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            }
        });
    });

exports.createOne = Model => 
    catchAsync(async (req, res, next) => {
        // const newBook = new Book({});
        // newBook.save();
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            }
        });
        // try {
            
        // } catch (err) {
        //     res.status(400).json({
        //         status: 'fail',
        //         message: err,
        //     });
        // }
    });

exports.getOne = (Model, popOptions) => 
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions)  query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            }
        });
    });

exports.getAll = Model => 
    catchAsync(async (req, res, next) => {
        // To allow for nested GET reviews on book (hack)
        let filter = {};
        if (req.params.bookId) filter = { book: req.params.bookId };

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        
        // const doc = await features.query.explain();
        const doc = await features.query;
        // const query = Book.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy');

        // send response
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc,
            }
        });
    }); 
