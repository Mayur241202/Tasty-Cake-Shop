import React, { useState, useEffect } from "react";
import InventoryManagement from "../components/branchManager/inventoryManagement";
import StaffManagement from "../components/branchManager/staffManagement";
import OrdersAnalysis from "../components/branchManager/ordersAnalysis";
import BranchManagerFeedback from "../components/branchManager/feedback";
import Header from "../components/header";
import API_BASE_URL from '../config';

const sidebarItems = [
  { name: "Inventory", icon: "📦" },
  { name: "Staff", icon: "👨‍🍳" },
  { name: "Orders", icon: "🧾" },
  { name: "Analysis", icon: "📊" },
  { name: "Feedback", icon: "📝" },
];

const BranchManagerDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Inventory");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userBranch, setUserBranch] = useState("Central");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserBranch(user.branch || "Central");
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header should be above sidebar, so z-10 here */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header hideNav={true} />
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center mt-[72px]">
          <div className="text-center">
            <p className="text-xl text-pink-700 font-semibold">Loading Dashboard...</p>
          </div>
        </div>
      ) : (
        <main className="flex flex-1 relative">
          {/* Sidebar (z-0, so header is above it) */}
          <div
            className={`transition-all duration-300 bg-white shadow-lg h-[calc(100vh-72px)] py-8 ${
              sidebarExpanded ? "w-48" : "w-16"
            } flex flex-col items-center z-0 fixed left-0 top-[72px] overflow-y-auto`}
            style={{ zIndex: 0 }}
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          >
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                className={`flex items-center w-full px-3 py-3 my-1 rounded-lg transition ${
                  selectedTab === item.name
                    ? "bg-pink-400 text-white"
                    : "hover:bg-pink-200 text-pink-800"
                }`}
                onClick={() => setSelectedTab(item.name)}
              >
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`ml-3 font-semibold transition-all duration-200 ${
                    sidebarExpanded ? "opacity-100" : "opacity-0 w-0"
                  }`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {sidebarExpanded && item.name}
                </span>
              </button>
            ))}
            <div className="flex-1" />
            <button
              className="w-full flex items-center justify-center px-3 py-3 mt-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition font-semibold"
              onClick={() => (window.location.href = "/")}
              title="Logout"
            >
              <span className="text-xl">🚪</span>
              <span
                className={`ml-3 transition-all duration-200 ${
                  sidebarExpanded ? "opacity-100" : "opacity-0 w-0"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                {sidebarExpanded && "Logout"}
              </span>
            </button>
          </div>
          {/* Main Content */}
          <div className="flex-1 p-6 ml-16 md:ml-48 mt-[72px]">
            {selectedTab === "Inventory" && <InventoryManagement branch={userBranch} />}
            {selectedTab === "Staff" && <StaffManagement />}
            {selectedTab === "Orders" && <OrdersAnalysis show="orders" />}
            {selectedTab === "Analysis" && <OrdersAnalysis show="analysis" />}
            {selectedTab === "Feedback" && <BranchManagerFeedback userBranch={userBranch} />}
          </div>
        </main>
      )}
    </div>
  );
};

export default BranchManagerDashboard;
