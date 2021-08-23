const mongoose = require('mongoose');
// const validator = require('validator');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A book must have a title'],
            trim: true,
            maxlength: [40, 'A book title must have less or equal than 40 characters'],
            minlength: [1, 'A book title cannot be empty'],
        },
        authors: {
            type: [String],
            required: [true, 'A book must have one or more authors'],
        },
        publisher: String,
        publishedDate: {
            type: Date,
            // required: [true, 'A book must have publishedDate'],
        },
        description: {
            type: String,
            trim: true
        },
        isbn: {
            type: String,
            unique: true,
            required: [true, 'A book must have an isbn']
        }, 
        pageCount: Number,
        categories: [String],
        thumbnail: {
            type: String,
            default: 'noThumbnail.jpg'
        },
        language: {
            type: String,
            required: [true, 'Must state book language code']
        },
        infolink: String,
        secretBook: {
            type: Boolean,
            default: false,
        }, 
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        price: {
            type: Number,
            required: [true, 'A book must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    // this only points to current doc on NEW document creation.
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) should be below regular price' //here VALUE is internal to mongoose, nothing to do with JS
                // message has access to the entered value.
            }
        },
        ratingsAverage: {
            type: Number, 
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
    }
    ,{
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

bookSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'book',
    localField: '_id'
});

// DOCUMENT MIDDLEWARE

// bookSchema.pre('save', function(next) {
//     console.log('will save document...');
//     next();
// });

// QUERY MIDDLEWARE
bookSchema.pre(/^find/, function(next) {
    this.find({secretBook: {$ne: true} });
    
    this.start = Date.now();
    next();
});

bookSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} ms`);
    next();
});

// AGGREGATION MIDDLEWARE
bookSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretBook: { $ne: true }}});
    // console.log(this.pipeline());
    next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;