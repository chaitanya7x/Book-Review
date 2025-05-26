import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/books');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If search query is empty, fetch all books instead
      fetchBooks();
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching books:', error);
      setBooks([]); // Set empty array on error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Books</h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or genre..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Link
            key={book._id}
            to={`/books/${book._id}`}
            className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {book.title}
                </h2>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-600 font-medium">
                    {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">By {book.author}</p>
              <p className="text-gray-500 text-sm line-clamp-3 mb-4">{book.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{book.reviews ? book.reviews.length : 0} reviews</span>
                <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                  Read more →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
};

export default Home; 