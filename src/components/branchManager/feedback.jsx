import React, { useState, useEffect } from "react";
import API_BASE_URL from '../../config';

const BranchManagerFeedback = ({ userBranch }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchBranchFeedbacks();
  }, [userBranch]);

  const fetchBranchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/feedback/branch/${userBranch}`);
      const data = await response.json();
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await fetch(`${API_BASE_URL}/api/feedback/${id}`, {
          method: "DELETE"
        });
        setFeedbacks(feedbacks.filter(f => f._id !== id));
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredFeedbacks = filterRating === "all" 
    ? feedbacks 
    : feedbacks.filter(f => f.rating === parseInt(filterRating));

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
          📝 Customer Feedback - {userBranch}
        </h2>
        <p className="text-gray-600">Monitor feedback for your branch</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-semibold mb-2">TOTAL FEEDBACKS</p>
          <h3 className="text-4xl font-bold text-green-600">{feedbacks.length}</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-semibold mb-2">AVERAGE RATING</p>
          <h3 className="text-3xl font-bold text-yellow-600">{averageRating} ⭐</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-semibold mb-2">SATISFACTION</p>
          <h3 className="text-3xl font-bold text-blue-600">
            {feedbacks.length > 0 ? Math.round((feedbacks.filter(f => f.rating >= 4).length / feedbacks.length) * 100) : 0}%
          </h3>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterRating("all")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterRating === "all"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Feedbacks
        </button>
        {[5, 4, 3, 2, 1].map(rating => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating.toString())}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterRating === rating.toString()
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {rating} ⭐ ({feedbacks.filter(f => f.rating === rating).length})
          </button>
        ))}
      </div>

      {/* Feedbacks List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading feedbacks...</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No feedbacks found for your branch</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map(feedback => (
            <div key={feedback._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{feedback.customerName}</h4>
                  <p className="text-sm text-gray-500">{feedback.customerEmail}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(feedback.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl">{renderStars(feedback.rating)}</p>
                  <p className="text-sm font-semibold text-gray-700">{feedback.rating}/5</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{feedback.text}</p>

              <button
                onClick={() => deleteFeedback(feedback._id)}
                className="text-red-600 hover:text-red-800 font-semibold text-sm mt-3 transition"
              >
                Delete Feedback
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchManagerFeedback;
