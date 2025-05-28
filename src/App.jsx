// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Customer from "./pages/customer";
import BranchManagerDashboard from "./pages/branchManagerDashboard";
import About from "./pages/about";
import Contact from "./pages/contact";
import AdminDashboard from "./pages/adminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/branch-manager" element={<BranchManagerDashboard />} />
        <Route path="/branchmanager" element={<BranchManagerDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Main admin dashboard route */}
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Optionally, keep the old admin-dashboard route for backward compatibility */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
