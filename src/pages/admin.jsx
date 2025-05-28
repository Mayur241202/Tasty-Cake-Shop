import React from "react";
import Header from "../components/header";

const Admin = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-[#8c2673] mb-4">Admin Dashboard</h1>
        <p className="text-lg mb-6">
          Welcome, Administrator! You have full system access.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-pink-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Branch Management</h2>
            <p>View, add, edit, or remove branches. Assign managers to branches.</p>
            {/* Add branch management actions here */}
          </div>
          <div className="bg-pink-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <p>Manage all users, assign roles, and control access.</p>
            {/* Add user management actions here */}
          </div>
          <div className="bg-pink-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Promotions</h2>
            <p>Create and manage promotional offers for customers.</p>
            {/* Add promotion management actions here */}
          </div>
          <div className="bg-pink-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p>View sales analytics and system reports.</p>
            {/* Add analytics charts or tables here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
