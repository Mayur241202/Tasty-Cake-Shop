import React from "react";
import Header from "../components/header";

const BranchManager = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-[#8c2673] mb-4">Branch Manager Dashboard</h1>
        <p className="text-lg mb-6">
          Welcome, Branch Manager! Manage your branch operations here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Inventory & Product Listings</h2>
            <p>Manage branch inventory and update product listings.</p>
            {/* Add inventory/product management actions here */}
          </div>
          <div className="bg-yellow-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Staff & Order Processing</h2>
            <p>Manage staff and process customer orders efficiently.</p>
            {/* Add staff/order management actions here */}
          </div>
          <div className="bg-yellow-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Sales & Customer Orders</h2>
            <p>Monitor branch sales and track customer orders.</p>
            {/* Add sales/order monitoring actions here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BranchManager;
