import React, { useState, useEffect } from "react";
import API_BASE_URL from '../config';

const LoyaltyProgram = ({ profile, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/loyalty/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching loyalty history:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        title="Close"
      >
        &times;
      </button>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
          🎁 Loyalty Program
        </h2>
        <p className="text-gray-600">Track your rewards and redeem points on purchases</p>
      </div>

      {/* Current Balance */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm font-semibold opacity-90 mb-2">CURRENT BALANCE</p>
          <h3 className="text-4xl font-bold mb-4">{profile?.loyaltyPoints || 0}</h3>
          <p className="text-sm opacity-90">Points available to redeem</p>
        </div>

        {/* Redemption Value Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm font-semibold opacity-90 mb-2">REDEMPTION VALUE</p>
          <h3 className="text-4xl font-bold mb-4">₹{Math.floor((profile?.loyaltyPoints || 0) / 1000)}</h3>
          <p className="text-sm opacity-90">1000 points = ₹1 discount</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Program Benefits</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="font-semibold text-gray-800">Earn Points</p>
              <p className="text-sm text-gray-600">Get 1 point for every ₹1 spent</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-semibold text-gray-800">Redeem Points</p>
              <p className="text-sm text-gray-600">Use 1000+ points for ₹1 discount</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-gray-800">Track Progress</p>
              <p className="text-sm text-gray-600">View your transaction history</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-semibold text-gray-800">More Rewards</p>
              <p className="text-sm text-gray-600">Unlock exclusive benefits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>
        
        {loading ? (
          <p className="text-gray-600 text-center py-8">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition">
                <div className="flex items-center gap-3 flex-1">
                  <span className={`text-2xl ${transaction.type === "earn" ? "text-green-500" : "text-red-500"}`}>
                    {transaction.type === "earn" ? "➕" : "➖"}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{transaction.reason}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${transaction.type === "earn" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "earn" ? "+" : "-"}{transaction.points}
                  </p>
                  <p className="text-xs text-gray-500">Balance: {transaction.balanceAfter}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyProgram;
