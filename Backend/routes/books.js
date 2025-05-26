const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, searchBooks } = require('../controllers/bookController');
const auth = require('../middleware/auth');

router.get('/search', searchBooks);
router.post('/', auth, addBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);

module.exports = router; 