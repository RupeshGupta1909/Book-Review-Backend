const Review = require('../models/review-model');
const ApiResponse = require('../utils/response-util');
const ReviewValidator = require('../validators/review-validator');
const ReviewPresenter = require('../presenters/review-presenter');
const MESSAGES = require('../constants/messages');

class ReviewController {
    async createReview(req, res) {
        try {
            const validator = new ReviewValidator('create');
            if (!validator.validate({ ...req.body, bookId: req.params.bookId })) {
                return res.status(400).json(
                    ApiResponse.badRequest(MESSAGES.VALIDATION_FAILED, { errors: validator.errors })
                );
            }

            const existingReview = await Review.findOne({
                user: req.user._id,
                book: req.params.bookId
            });

            if (existingReview) {
                return res.status(400).json(
                    ApiResponse.badRequest(MESSAGES.REVIEW_ALREADY_EXISTS)
                );
            }

            const review = await Review.create({
                ...validator.value,
                user: req.user._id,
                book: req.params.bookId
            });

            res.status(201).json(
                ApiResponse.created({ review: ReviewPresenter.present(review) })
            );
        } catch (error) {
            res.status(400).json(
                ApiResponse.error(400, error.message)
            );
        }
    }

    async updateReview(req, res) {
        try {
            const idValidator = new ReviewValidator('id');
            if (!idValidator.validate({ id: req.params.id })) {
                return res.status(400).json(
                    ApiResponse.badRequest(MESSAGES.VALIDATION_FAILED, { errors: idValidator.errors })
                );
            }

            const updateValidator = new ReviewValidator('update');
            if (!updateValidator.validate(req.body)) {
                return res.status(400).json(
                    ApiResponse.badRequest(MESSAGES.VALIDATION_FAILED, { errors: updateValidator.errors })
                );
            }

            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json(
                    ApiResponse.notFound(MESSAGES.REVIEW_NOT_FOUND)
                );
            }

            if (review.user.toString() !== req.user._id.toString()) {
                return res.status(403).json(
                    ApiResponse.forbidden(MESSAGES.REVIEW_UPDATE_UNAUTHORIZED)
                );
            }

            const updatedReview = await Review.findByIdAndUpdate(
                req.params.id,
                updateValidator.value,
                {
                    new: true,
                    runValidators: true
                }
            );

            res.status(200).json(
                ApiResponse.success({ review: ReviewPresenter.present(updatedReview) })
            );
        } catch (error) {
            res.status(400).json(
                ApiResponse.error(400, error.message)
            );
        }
    }

    async deleteReview(req, res) {
        try {
            const validator = new ReviewValidator('id');
            if (!validator.validate({ id: req.params.id })) {
                return res.status(400).json(
                    ApiResponse.badRequest(MESSAGES.VALIDATION_FAILED, { errors: validator.errors })
                );
            }

            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json(
                    ApiResponse.notFound(MESSAGES.REVIEW_NOT_FOUND)
                );
            }

            if (review.user.toString() !== req.user._id.toString()) {
                return res.status(403).json(
                    ApiResponse.forbidden(MESSAGES.REVIEW_DELETE_UNAUTHORIZED)
                );
            }

            await Review.findByIdAndDelete(req.params.id);

            res.status(204).json(
                ApiResponse.success(null, MESSAGES.REVIEW_DELETED)
            );
        } catch (error) {
            res.status(400).json(
                ApiResponse.error(400, error.message)
            );
        }
    }
}

module.exports = new ReviewController(); 