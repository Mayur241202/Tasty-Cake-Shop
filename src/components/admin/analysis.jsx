import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const COLORS = ["#f472b6", "#a78bfa", "#fbbf24", "#34d399", "#60a5fa"];

const AdminAnalysis = () => {
  const [branchData, setBranchData] = useState([]);
  const [locationFilter, setLocationFilter] = useState("All");
  const [allLocations, setAllLocations] = useState([]);
  const [salesByDate, setSalesByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch all orders and branches
        const [ordersRes, branchesRes] = await Promise.all([
          fetch("http://localhost:5000/api/orders/all"),
          fetch("http://localhost:5000/api/branches")
        ]);

        if (!ordersRes.ok || !branchesRes.ok) {
          console.error("Failed to fetch data");
          return;
        }

        const orders = await ordersRes.json();
        const branches = await branchesRes.json();

        // Calculate branch-wise analytics
        const branchMap = {};
        const locationMap = {};

        branches.forEach(branch => {
          branchMap[branch.name] = {
            branch: branch.name,
            location: branch.location,
            orders: 0,
            sales: 0
          };
          if (!locationMap[branch.location]) {
            locationMap[branch.location] = true;
          }
        });

        // Process orders
        orders.forEach(order => {
          if (branchMap[order.branch]) {
            branchMap[order.branch].orders += 1;
            branchMap[order.branch].sales += order.total || 0;
          }
        });

        const analyticsData = Object.values(branchMap);
        setBranchData(analyticsData);
        setAllLocations(Object.keys(locationMap));
        
        // Calculate total stats
        const total = analyticsData.reduce((sum, b) => sum + b.orders, 0);
        const sales = analyticsData.reduce((sum, b) => sum + b.sales, 0);
        setTotalOrders(total);
        setTotalSales(sales);

        // Calculate sales by date (last 7 days)
        const dateMap = {};
        orders.forEach(order => {
          const date = new Date(order.date).toLocaleDateString();
          if (!dateMap[date]) {
            dateMap[date] = 0;
          }
          dateMap[date] += order.total || 0;
        });

        const lastSevenDays = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString();
          lastSevenDays.push({
            date: dateStr,
            sales: dateMap[dateStr] || 0
          });
        }
        setSalesByDate(lastSevenDays);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const filteredData =
    locationFilter === "All"
      ? branchData
      : branchData.filter(b => b.location === locationFilter);

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">📊 Admin Analytics</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl shadow p-6">
          <h3 className="text-gray-700 font-semibold mb-2">Total Orders</h3>
          <p className="text-4xl font-bold text-pink-700">{totalOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow p-6">
          <h3 className="text-gray-700 font-semibold mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-purple-700">₹{totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow p-6">
          <h3 className="text-gray-700 font-semibold mb-2">Branches</h3>
          <p className="text-4xl font-bold text-blue-700">{branchData.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <label className="font-semibold text-pink-700">Filter by Location:</label>
        <select
          className="border rounded px-3 py-2"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        >
          <option value="All">All Locations</option>
          {allLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart: Orders per Branch */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-pink-600">📦 Orders per Branch</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#f472b6" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Sales Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-pink-600">💰 Sales Distribution by Branch</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="sales"
                nameKey="branch"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {filteredData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-pink-600">📈 Sales Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#f472b6" 
              strokeWidth={2}
              dot={{ fill: '#f472b6', r: 5 }}
              activeDot={{ r: 7 }}
              name="Daily Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Branch Details Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-pink-600">📋 Branch Performance Details</h3>
        </div>
        <table className="w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-pink-700">Branch</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-pink-700">Location</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-pink-700">Orders</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-pink-700">Revenue</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-pink-700">Avg Order Value</th>
            </tr>
          </thead>
          <tbody>
            {branchData.map((branch, idx) => (
              <tr key={idx} className="border-b hover:bg-pink-50 transition">
                <td className="px-6 py-3 font-semibold text-gray-700">{branch.branch}</td>
                <td className="px-6 py-3 text-gray-600">{branch.location}</td>
                <td className="px-6 py-3 text-center text-gray-700">{branch.orders}</td>
                <td className="px-6 py-3 text-center font-semibold text-green-600">₹{branch.sales.toLocaleString()}</td>
                <td className="px-6 py-3 text-center text-gray-600">
                  ₹{branch.orders > 0 ? (branch.sales / branch.orders).toFixed(0) : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAnalysis;
