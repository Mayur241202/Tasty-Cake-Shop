import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const branchData = [
  { branch: "Central", location: "Delhi", orders: 120, sales: 50000 },
  { branch: "West", location: "Mumbai", orders: 90, sales: 42000 },
  { branch: "East", location: "Kolkata", orders: 70, sales: 31000 },
];

const COLORS = ["#f472b6", "#a78bfa", "#fbbf24"];

const AdminAnalysis = () => {
  const [locationFilter, setLocationFilter] = useState("All");

  const filteredData =
    locationFilter === "All"
      ? branchData
      : branchData.filter(b => b.location === locationFilter);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Branch Analytics</h2>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <label className="font-semibold text-pink-700">Filter by Location:</label>
        <select
          className="border rounded px-3 py-1"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        >
          <option value="All">All</option>
          {[...new Set(branchData.map(b => b.location))].map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart: Orders per Branch */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-pink-600">Orders per Branch</h3>
          <ResponsiveContainer width="100%" height={250}>
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
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-pink-600">Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
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
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalysis;
