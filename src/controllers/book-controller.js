const Book = require('../models/book-model');
const ApiResponse = require('../utils/response-util');
const BookValidator = require('../validators/book-validator');

class BookController {
    async getAllBooks(req, res) {
        try {
        // Extract query parameters with defaults
        const queryParams = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            author: req.query.author || undefined,
            genre: req.query.genre || undefined
        };

        const validator = new BookValidator('list');
        if (!validator.validate(queryParams)) {
            return res.status(400).json(
            ApiResponse.badRequest('Validation failed', { errors: validator.errors })
            );
        }

        const { page, limit, author, genre } = validator.value;
        const skip = (page - 1) * limit;
        let query = Book.find();

        // Apply filters if they exist
        if (author) {
            query = query.where('author').equals(author);
        }
        if (genre) {
            query = query.where('genre').equals(genre);
        }

        // Execute query with pagination
        const books = await query
            .skip(skip)
            .limit(limit)
            .populate('reviews');

        // Get total count for pagination
        const total = await Book.countDocuments(query.getQuery());

        res.status(200).json(
            ApiResponse.success({
            books,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
            })
        );
        } catch (error) {
        res.status(400).json(
            ApiResponse.error(400, error.message)
        );
        }
    }

    async getBookById(req, res) {
        try {
        const validator = new BookValidator('id');
        if (!validator.validate({ id: req.params.id })) {
            return res.status(400).json(
            ApiResponse.badRequest('Validation failed', { errors: validator.errors })
            );
        }

        const book = await Book.findById(req.params.id).populate({
            path: 'reviews',
            options: {
            sort: { createdAt: -1 },
            limit: parseInt(req.query.reviewLimit) || 10,
            skip: (parseInt(req.query.reviewPage) - 1 || 0) * (parseInt(req.query.reviewLimit) || 10)
            }
        });

        if (!book) {
            return res.status(404).json(
            ApiResponse.notFound('Book not found')
            );
        }

        res.status(200).json(
            ApiResponse.success({ book })
        );
        } catch (error) {
        res.status(400).json(
            ApiResponse.error(400, error.message)
        );
        }
    }

    async createBook(req, res) {
        try {
        const validator = new BookValidator('create');
        if (!validator.validate(req.body)) {
            return res.status(400).json(
            ApiResponse.badRequest('Validation failed', { errors: validator.errors })
            );
        }

        const book = await Book.create(validator.value);
        res.status(201).json(
            ApiResponse.created({ book })
        );
        } catch (error) {
        res.status(400).json(
            ApiResponse.error(400, error.message)
        );
        }
    }

    async searchBooks(req, res) {
        try {
            const validator = new BookValidator('search');
            if (!validator.validate(req.query)) {
                return res.status(400).json(
                ApiResponse.badRequest('Validation failed', { errors: validator.errors })
                );
            }

            const { q } = validator.value;
            const books = await Book.find(
                { $text: { $search: q } },
                { score: { $meta: 'textScore' } }
            )
            .sort({ score: { $meta: 'textScore' } })
            .limit(10);

            res.status(200).json(
                ApiResponse.success({ books })
            );
        } catch (error) {
            res.status(400).json(
                ApiResponse.error(400, error.message)
            );
        }
    }
}

module.exports = new BookController(); 