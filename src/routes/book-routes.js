const express = require('express');
const bookController = require('../controllers/book-controller');
const { protect } = require('../middleware/auth-middleware');
const router = express.Router();

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', protect, bookController.createBook);
router.get('/search/query', bookController.searchBooks);

module.exports = router; 