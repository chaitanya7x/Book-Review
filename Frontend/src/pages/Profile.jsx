import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserReviews();
  }, [user, navigate]);

  const fetchUserReviews = async () => {
    try {
      const response = await fetch('http://localhost:3000/reviews/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1 text-gray-900">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {review.book?.title || 'Book title not available'}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600">{review.rating}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center text-gray-500">
              You haven't written any reviews yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 