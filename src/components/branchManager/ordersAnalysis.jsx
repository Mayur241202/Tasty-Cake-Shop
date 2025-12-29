import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

// Helper: group by date
const getOrdersByDate = (orders) => {
  const map = {};
  orders.forEach(o => {
    map[o.date] = (map[o.date] || 0) + 1;
  });
  return Object.entries(map).map(([date, count]) => ({ date, count }));
};

// Helper: sales by date
const getSalesByDate = (orders) => {
  const map = {};
  orders.forEach(o => {
    // Extract just the date part (YYYY-MM-DD) to group by day, not by exact time
    const dateOnly = new Date(o.date).toLocaleDateString();
    map[dateOnly] = (map[dateOnly] || 0) + o.total;
  });
  return Object.entries(map).map(([date, sales]) => ({ date, sales }));
};

// Helper: group by product type
const getProductDistribution = (orders) => {
  const map = {};
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const productName = item.title || "Unknown";
        map[productName] = (map[productName] || 0) + item.qty;
      });
    }
  });
  return Object.entries(map).map(([product, quantity]) => ({ product, quantity }));
};

const COLORS = ["#f472b6", "#a78bfa", "#fbbf24", "#34d399", "#60a5fa"];

const statusColors = {
  Delivered: "bg-green-500",
  Processing: "bg-yellow-500",
  Cancelled: "bg-red-500",
};

// Notification sound function
const playNotificationSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Play a pleasant ding sound
  oscillator.frequency.value = 800; // Hz
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

const OrdersAnalysis = ({ show }) => {
  // Load orders from MongoDB API
  const [allOrders, setAllOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [userBranch, setUserBranch] = useState(""); // Get branch manager's branch
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // Track selected order for details view
  const [newOrderNotification, setNewOrderNotification] = useState(null); // Notification for new orders
  const [socket, setSocket] = useState(null); // WebSocket connection

  useEffect(() => {
    // Get the branch manager's branch from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserBranch(user.branch || "Central");
    }
  }, []);

  // Fetch orders from MongoDB API when branch is set
  useEffect(() => {
    if (!userBranch) return;

    // Initialize socket.io connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    
    // Join the branch room
    newSocket.emit("join_branch", userBranch);

    // Fetch initial orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/orders/branch/${userBranch}`);
        if (response.ok) {
          const data = await response.json();
          setAllOrders(data);
        } else {
          console.error("Failed to fetch orders");
          setAllOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setAllOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Listen for new order events from socket.io
    newSocket.on("new_order", (newOrder) => {
      console.log("New order received:", newOrder);
      
      // Play notification sound
      playNotificationSound();
      
      // Show notification
      setNewOrderNotification({
        count: 1,
        customer: newOrder.customerName
      });
      
      // Refetch orders to get the latest data
      fetchOrders();
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => setNewOrderNotification(null), 5000);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userBranch]);

  // Update order status via API
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        // Update local state
        const updatedOrders = allOrders.map(order =>
          order._id === orderId ? updatedOrder : order
        );
        setAllOrders(updatedOrders);
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const ordersToShow = allOrders.length > 0
    ? (statusFilter === "All"
        ? allOrders
        : allOrders.filter(order => order.status === statusFilter))
    : [];

  const totalOrders = ordersToShow.length;
  const totalAmount = ordersToShow.reduce((sum, o) => sum + (o.total || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const dailyOrders = ordersToShow.filter((o) => {
    const orderDate = new Date(o.date).toISOString().slice(0, 10);
    return orderDate === today;
  });

  // Filtered orders for table
  const filteredOrders =
    statusFilter === "All"
      ? ordersToShow
      : ordersToShow.filter((order) => order.status === statusFilter);

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (show === "orders") {
    return (
      <div>
        {/* New Order Notification Popup */}
        {newOrderNotification && (
          <div className="fixed top-24 right-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-lg z-40 max-w-sm animate-pulse">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎉</div>
              <div className="flex-1">
                <h3 className="font-bold text-green-800 text-lg mb-1">New Order Received!</h3>
                <p className="text-green-700 mb-2">
                  {newOrderNotification.count} new order{newOrderNotification.count > 1 ? 's' : ''} from <span className="font-semibold">{newOrderNotification.customer}</span>
                </p>
                <button
                  onClick={() => setNewOrderNotification(null)}
                  className="text-sm text-green-600 hover:text-green-800 font-semibold underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-pink-700">Total Orders</h2>
        <div className="mb-4 text-lg">Total Orders: {totalOrders}</div>
        <div className="mb-4 text-lg">Total Sales: ₹{totalAmount}</div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-semibold text-pink-700">Filter by Status:</label>
          <select
            className="border rounded px-3 py-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Delivered">Delivered</option>
            <option value="Processing">Processing</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <h3 className="text-xl font-semibold mt-8 mb-2 text-pink-600">Recent Orders</h3>
        <table className="min-w-full bg-white rounded shadow text-center overflow-x-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Order ID</th>
              <th className="py-2 px-4 border-b text-center">Customer Name</th>
              <th className="py-2 px-4 border-b text-center">Customer Email</th>
              <th className="py-2 px-4 border-b text-center">Date</th>
              <th className="py-2 px-4 border-b text-center">Total</th>
              <th className="py-2 px-4 border-b text-center">Status</th>
              <th className="py-2 px-4 border-b text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b text-center">{order._id?.slice(-6) || order.id}</td>
                <td className="py-2 px-4 border-b text-center">{order.customerName || "-"}</td>
                <td className="py-2 px-4 border-b text-center">{order.customerEmail || "-"}</td>
                <td className="py-2 px-4 border-b text-center">{new Date(order.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-center">₹{order.total}</td>
                <td className="py-2 px-4 border-b text-center">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className={
                      "px-3 py-1 rounded-full text-white text-sm " +
                      (order.status === "Delivered"
                        ? "bg-green-500"
                        : order.status === "Processing"
                        ? "bg-yellow-500"
                        : order.status === "Cancelled"
                        ? "bg-red-500"
                        : "bg-gray-400")
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => setSelectedOrderDetails(order)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Order Details Modal */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setSelectedOrderDetails(null)}
              >
                ×
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Order Details</h2>
              
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b">
                <div>
                  <label className="font-semibold text-gray-700">Order ID</label>
                  <p className="text-gray-600 mt-1">{selectedOrderDetails._id?.slice(-6)}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Order Date</label>
                  <p className="text-gray-600 mt-1">{new Date(selectedOrderDetails.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Customer Name</label>
                  <p className="text-gray-600 mt-1">{selectedOrderDetails.customerName}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Customer Email</label>
                  <p className="text-gray-600 mt-1">{selectedOrderDetails.customerEmail}</p>
                </div>
              </div>
              
              {/* Delivery Information */}
              <div className="mb-8 pb-6 border-b">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700">Address</label>
                    <p className="text-gray-600 mt-1">{selectedOrderDetails.address}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">City</label>
                    <p className="text-gray-600 mt-1">{selectedOrderDetails.city}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Pincode</label>
                    <p className="text-gray-600 mt-1">{selectedOrderDetails.pincode}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Branch</label>
                    <p className="text-gray-600 mt-1">{selectedOrderDetails.branch}</p>
                  </div>
                </div>
              </div>
              
              {/* Products Information */}
              <div className="mb-8 pb-6 border-b">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Products Ordered</h3>
                <div className="space-y-3">
                  {selectedOrderDetails.items && selectedOrderDetails.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">₹{item.price}</p>
                        <p className="text-sm text-gray-600">Subtotal: ₹{item.price * item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-700">₹{selectedOrderDetails.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Status</span>
                    <span className={`px-4 py-1 rounded-full text-white font-semibold ${
                      selectedOrderDetails.status === "Delivered" ? "bg-green-500" :
                      selectedOrderDetails.status === "Processing" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}>
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Analysis tab
  const ordersByDate = getOrdersByDate(ordersToShow).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).reverse();
  const salesByDate = getSalesByDate(ordersToShow).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).reverse();
  const productDistribution = getProductDistribution(ordersToShow).sort((a, b) => b.quantity - a.quantity);
  
  // Calculate additional metrics
  const totalRevenue = ordersToShow.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = ordersToShow.length > 0 ? (totalRevenue / ordersToShow.length).toFixed(0) : 0;
  const completedOrders = ordersToShow.filter(o => o.status === "Delivered").length;
  const processingOrders = ordersToShow.filter(o => o.status === "Processing").length;
  const cancelledOrders = ordersToShow.filter(o => o.status === "Cancelled").length;
  const completionRate = ordersToShow.length > 0 ? ((completedOrders / ordersToShow.length) * 100).toFixed(1) : 0;
  const todaysSales = dailyOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-pink-700">📊 Branch Analytics & Performance</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-semibold text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-pink-700">{ordersToShow.length}</p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-semibold text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-semibold text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-blue-700">{completedOrders}</p>
              <p className="text-xs text-blue-600 mt-1">{completionRate}% rate</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-semibold text-sm mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold text-purple-700">₹{avgOrderValue}</p>
            </div>
            <span className="text-4xl">📈</span>
          </div>
        </div>
      </div>

      {/* Today's Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-pink-500">
          <p className="text-gray-600 text-sm font-semibold">Today's Orders</p>
          <p className="text-2xl font-bold text-pink-700">{dailyOrders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-semibold">Processing</p>
          <p className="text-2xl font-bold text-yellow-700">{processingOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-semibold">Today's Revenue</p>
          <p className="text-2xl font-bold text-green-700">₹{todaysSales.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-semibold">Cancelled</p>
          <p className="text-2xl font-bold text-red-700">{cancelledOrders}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart: Product Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-pink-600">🍰 Product Distribution by Type</h3>
          {productDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  dataKey="quantity"
                  nameKey="product"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ product, quantity }) => `${product}: ${quantity}`}
                >
                  {productDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value} units`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No product data available
            </div>
          )}
        </div>
        
        {/* Bar Chart: Sales by Date */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-pink-600">💹 Sales Trend (Last 5 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Bar dataKey="sales" fill="#f472b6" name="Sales" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-pink-600">🎯 Order Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { status: "Processing", count: processingOrders, fill: "#fbbf24" },
            { status: "Delivered", count: completedOrders, fill: "#34d399" },
            { status: "Cancelled", count: cancelledOrders, fill: "#ef4444" }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="count" fill="#f472b6" name="Orders" radius={[8, 8, 0, 0]}>
              {[
                { status: "Processing", count: processingOrders, fill: "#fbbf24" },
                { status: "Delivered", count: completedOrders, fill: "#34d399" },
                { status: "Cancelled", count: cancelledOrders, fill: "#ef4444" }
              ].map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-pink-50 to-pink-100">
          <h3 className="text-lg font-semibold text-pink-700">📋 Detailed Order Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-pink-700">Date</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-pink-700">Orders</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-pink-700">Revenue</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-pink-700">Avg Value</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-pink-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...new Set(ordersToShow.map(o => new Date(o.date).toLocaleDateString()))].map((date, idx) => {
                const dateOrders = ordersToShow.filter(o => new Date(o.date).toLocaleDateString() === date);
                const dateRevenue = dateOrders.reduce((sum, o) => sum + o.total, 0);
                const avgValue = dateOrders.length > 0 ? (dateRevenue / dateOrders.length).toFixed(0) : 0;
                return (
                  <tr key={idx} className="border-b hover:bg-pink-50 transition">
                    <td className="px-6 py-3 font-semibold text-gray-700">{date}</td>
                    <td className="px-6 py-3 text-center text-gray-700 font-semibold">{dateOrders.length}</td>
                    <td className="px-6 py-3 text-center text-green-600 font-semibold">₹{dateRevenue.toLocaleString()}</td>
                    <td className="px-6 py-3 text-center text-gray-600">₹{avgValue}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {dateOrders.length} orders
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersAnalysis;
