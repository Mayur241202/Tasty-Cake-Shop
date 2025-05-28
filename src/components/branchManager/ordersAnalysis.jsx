import React, { useState, useEffect } from "react";
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
    map[o.date] = (map[o.date] || 0) + o.total;
  });
  return Object.entries(map).map(([date, sales]) => ({ date, sales }));
};

const COLORS = ["#f472b6", "#a78bfa", "#fbbf24", "#34d399", "#60a5fa"];

const statusColors = {
  Delivered: "bg-green-500",
  Processing: "bg-yellow-500",
  Cancelled: "bg-red-500",
};

const OrdersAnalysis = ({ show }) => {
  // Load all orders placed by customers from localStorage (simulate backend)
  const [allOrders, setAllOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // Simulate fetching all orders placed by customers (saved in localStorage by customer page)
    const savedOrders = JSON.parse(localStorage.getItem("all_customer_orders") || "[]");
    setAllOrders(savedOrders);
  }, []);

  // Update order status and sync to localStorage
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = allOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setAllOrders(updatedOrders);
    localStorage.setItem("all_customer_orders", JSON.stringify(updatedOrders));
  };

  const ordersToShow = allOrders.length > 0
    ? (statusFilter === "All"
        ? allOrders
        : allOrders.filter(order => order.status === statusFilter))
    : [
        // fallback dummy data if no orders in localStorage
        { id: 1, date: "2024-06-20", total: 1200, customerName: "John Doe", customerEmail: "john@example.com", status: "Delivered", branch: "Central" },
        { id: 2, date: "2024-06-20", total: 800, customerName: "Priya Sharma", customerEmail: "priya@example.com", status: "Processing", branch: "West" },
        { id: 3, date: "2024-06-19", total: 950, customerName: "Amit Kumar", customerEmail: "amit@example.com", status: "Delivered", branch: "East" },
        { id: 4, date: "2024-06-18", total: 1100, customerName: "Rahul Singh", customerEmail: "rahul@example.com", status: "Cancelled", branch: "Central" },
        { id: 5, date: "2024-06-18", total: 700, customerName: "Neha Verma", customerEmail: "neha@example.com", status: "Delivered", branch: "West" },
      ];

  const totalOrders = ordersToShow.length;
  const totalAmount = ordersToShow.reduce((sum, o) => sum + (o.total || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const dailyOrders = ordersToShow.filter((o) => o.date === today);

  // Filtered orders for table
  const filteredOrders =
    statusFilter === "All"
      ? ordersToShow
      : ordersToShow.filter((order) => order.status === statusFilter);

  if (show === "orders") {
    return (
      <div>
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
        <table className="min-w-full bg-white rounded shadow text-center">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Order ID</th>
              <th className="py-2 px-4 border-b text-center">Customer Name</th>
              <th className="py-2 px-4 border-b text-center">Customer Email</th>
              <th className="py-2 px-4 border-b text-center">Branch</th>
              <th className="py-2 px-4 border-b text-center">Date</th>
              <th className="py-2 px-4 border-b text-center">Total</th>
              <th className="py-2 px-4 border-b text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b text-center">{order.id}</td>
                <td className="py-2 px-4 border-b text-center">{order.customerName || "-"}</td>
                <td className="py-2 px-4 border-b text-center">{order.customerEmail || "-"}</td>
                <td className="py-2 px-4 border-b text-center">{order.branch || "-"}</td>
                <td className="py-2 px-4 border-b text-center">{order.date}</td>
                <td className="py-2 px-4 border-b text-center">₹{order.total}</td>
                <td className="py-2 px-4 border-b text-center">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Analysis tab
  const ordersByDate = getOrdersByDate(ordersToShow).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).reverse();
  const salesByDate = getSalesByDate(ordersToShow).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).reverse();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Daily Orders & Analysis</h2>
      <div className="mb-4 text-lg">Today's Orders: {dailyOrders.length}</div>
      <div className="mb-4 text-lg">
        Today's Sales: ₹{dailyOrders.reduce((sum, o) => sum + o.total, 0)}
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart: Orders Distribution by Date */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-pink-600">Orders Distribution (Pie)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersByDate}
                dataKey="count"
                nameKey="date"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {ordersByDate.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Bar Chart: Sales by Date */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-pink-600">Sales Trend (Bar)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="sales" fill="#f472b6" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-pink-600">Order Trend (Last 3 Days)</h3>
        <ul className="list-disc ml-6 text-gray-700">
          {[...new Set(ordersToShow.map(o => o.date))]
            .slice(0, 3)
            .map(date => (
              <li key={date}>
                {date}: {ordersToShow.filter(o => o.date === date).length} orders, ₹
                {ordersToShow.filter(o => o.date === date).reduce((sum, o) => sum + o.total, 0)}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersAnalysis;
