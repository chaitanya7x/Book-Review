const Book = require('../models/Book');
const Review = require('../models/Review');

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    // Input validation
    if (!title || !author || !genre || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (title.length < 2 || author.length < 2) {
      return res.status(400).json({ error: 'Title and author must be at least 2 characters long' });
    }

    if (description.length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters long' });
    }

    const book = new Book({ title, author, genre, description, createdBy: req.user.id });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const query = {};
    if (author) query.author = author;
    if (genre) query.genre = genre;
    const books = await Book.find(query).limit(limit * 1).skip((page - 1) * limit);
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 