const express = require('express');
const reviewController = require('../controllers/review-controller');
const { protect } = require('../middleware/auth-middleware');
const router = express.Router();

router.post('/:bookId', protect, reviewController.createReview);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router; 