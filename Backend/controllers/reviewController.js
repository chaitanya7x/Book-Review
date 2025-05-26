const Review = require('../models/Review');
const Book = require('../models/Book');

exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    // Input validation
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (comment.length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters long' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book: bookId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this book' });
    }

    const review = new Review({ book: bookId, user: req.user.id, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('book', 'title author coverImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching user reviews' });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getUserReviews
}; 