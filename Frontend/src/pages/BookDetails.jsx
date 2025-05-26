import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`);
      const data = await response.json();
      setBook(data);
      setReviews(data.reviews || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`http://localhost:3000/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      const data = await response.json();
      setReviews([...reviews, data]);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
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
        <h3 className="mt-2 text-lg font-medium text-gray-900">Book not found</h3>
        <p className="mt-1 text-gray-500">The book you're looking for doesn't exist</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">By {book.author}</p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="ml-2 text-gray-600 text-xl font-medium">
                  {book.averageRating ? book.averageRating.toFixed(1) : 'No ratings'}
                </span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{reviews.length} reviews</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} {rating === 1 ? 'star' : 'stars'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your thoughts about this book..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600 font-medium">{review.rating}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    By {review.user?.username || 'Anonymous'} on{' '}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isAuthenticated && review.user?._id === user._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-8">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-gray-500">Be the first to review this book!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails; 