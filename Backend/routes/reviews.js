const express = require('express');
const router = express.Router();
const { addReview, updateReview, deleteReview, getUserReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/user', auth, getUserReviews);
router.post('/:bookId', auth, addReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

module.exports = router; 