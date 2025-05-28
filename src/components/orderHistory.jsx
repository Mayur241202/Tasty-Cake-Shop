import React from "react";

const OrderHistory = ({ orders }) => (
  <div className="bg-blue-50 rounded-xl shadow p-6 mb-6 max-w-2xl mx-auto mt-16">
    <h2 className="text-xl font-semibold mb-4">Order History</h2>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="py-2">Order ID</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id} className="border-t">
            <td className="py-2">{order.id}</td>
            <td>{order.date}</td>
            <td>{order.items.join(", ")}</td>
            <td>₹{order.total}</td>
            <td>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  order.status === "Delivered"
                    ? "bg-green-200 text-green-800"
                    : order.status === "Processing"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderHistory;
