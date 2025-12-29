import React, { useState } from "react";
import API_BASE_URL from '../config';

const OrderHistory = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Format date to readable format
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

  // Get total items count
  const getTotalItems = (items) => {
    if (!items) return 0;
    return Array.isArray(items) 
      ? items.reduce((sum, item) => sum + (item.qty || 1), 0)
      : 0;
  };

  // Get product names from items
  const getProductNames = (items) => {
    if (!items || !Array.isArray(items)) return "N/A";
    return items.map(item => item.title || "Unknown").join(", ");
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl shadow p-8 mb-6 max-w-4xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">📦 Order History</h2>
        <p className="text-gray-600">No orders yet. Start shopping to see your order history!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 mb-6 max-w-5xl mx-auto mt-16" 
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          📦 Order History
        </h2>
        <p className="text-gray-600 text-sm mt-2">Total Orders: <span className="font-bold text-blue-700">{orders.length}</span></p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id || order.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-blue-500"
            onClick={e => e.stopPropagation()}
          >
            {/* Order Header */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedOrder(expandedOrder === order._id ? null : order._id);
              }}
              className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex-1 text-left">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Order ID */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">ORDER ID</p>
                    <p className="font-mono text-sm font-bold text-gray-800">
                      #{order._id?.slice(-6) || order.id}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">DATE</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(order.date)}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">ITEMS</p>
                    <p className="text-sm font-medium text-gray-700">
                      {getTotalItems(order.items)} item{getTotalItems(order.items) !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Total & Status */}
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">TOTAL</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{order.total?.toLocaleString() || 0}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {order.status === "Delivered" && "✓ "}
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expand Icon */}
              <div className="ml-4">
                <span className={`text-2xl transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedOrder === order._id && (
              <div 
                className="border-t bg-gray-50 p-4 md:p-6"
                onClick={e => e.stopPropagation()}
              >
                {/* Products */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-sm">📋 PRODUCTS ORDERED</h4>
                  <div className="space-y-2 bg-white rounded p-4 border border-gray-200">
                    {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pb-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-800">{item.title || "Unknown"}</p>
                            <p className="text-xs text-gray-500">Quantity: {item.qty || 1}</p>
                          </div>
                          <p className="font-semibold text-gray-700">₹{(item.price * (item.qty || 1)).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No items information available</p>
                    )}
                  </div>
                </div>

                {/* Delivery Details */}
                {(order.address || order.city || order.pincode) && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">📍 DELIVERY ADDRESS</h4>
                    <div className="bg-white rounded p-4 border border-gray-200 text-sm">
                      <p className="text-gray-800 mb-2">{order.address}</p>
                      <p className="text-gray-600">
                        {order.city}{order.pincode && `, ${order.pincode}`}
                      </p>
                      {order.branch && (
                        <p className="text-gray-600 mt-2">
                          <span className="font-semibold">Branch:</span> {order.branch}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded p-4 border border-blue-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold">₹{order.total?.toLocaleString() || 0}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold text-gray-800">Total Amount:</span>
                        <span className="font-bold text-green-600">₹{order.total?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
