import React, { useState, useRef, useEffect } from "react";
import CustomerHeader from "../components/customerHeader";
import Card from "../components/card";
import Cart from "../components/cart";
import OrderHistory from "../components/orderHistory";
import OffersSection from "../components/offersSection"; // <-- import offers section
import { toast } from "react-toastify";

// Dummy data for demonstration
const dummyOrdersInit = [
  { id: 1, date: "2025-04-01", items: ["Chocolate Cake", "Cupcake"], total: 350, status: "Delivered" },
  { id: 2, date: "2025-04-10", items: ["Red Velvet Cake"], total: 500, status: "Processing" },
];

const dummyProfile = {
  name: "Ketan Jedhe",
  email: "ketan@gmail.com",
  mobile: "9875643857",
  loyaltyPoints: 120,
};

// Dummy products for the shop with categories
const dummyProducts = [
  {
    id: 1,
    title: "Chocolate Cake",
    price: 300,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    description: "Rich and moist chocolate cake topped with creamy chocolate frosting.",
    category: "Cakes",
  },
  {
    id: 2,
    title: "Red Velvet Cake",
    price: 500,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    description: "Classic red velvet cake with smooth cream cheese icing.",
    category: "Cakes",
  },
  {
    id: 3,
    title: "Vanilla Pastry",
    price: 80,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    description: "Soft vanilla pastry with whipped cream.",
    category: "Pastries",
  },
  {
    id: 4,
    title: "Chocolate Pastry",
    price: 90,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    description: "Delicious chocolate pastry with chocolate chips.",
    category: "Pastries",
  },
  {
    id: 5,
    title: "Veg Puff",
    price: 40,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    description: "Crispy puff stuffed with spicy veggies.",
    category: "Snacks",
  },
  {
    id: 6,
    title: "Cookies",
    price: 30,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    description: "Crunchy and delicious cookies, perfect for snacking.",
    category: "Snacks",
  },
  {
    id: 7,
    title: "Cupcake",
    price: 50,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    description: "Soft and fluffy cupcakes in assorted flavors.",
    category: "Cakes",
  },
];

const categories = [
  { name: "All", icon: "🎂" },
  { name: "Cakes", icon: "🍰" },
  { name: "Pastries", icon: "🥮" },
  { name: "Snacks", icon: "🍪" },
  { name: "Offers", icon: "🎁" }, // <-- add Offers to sidebar
];

const branches = [
  { id: 1, name: "Central", location: "Delhi" },
  { id: 2, name: "West", location: "Mumbai" },
  { id: 3, name: "East", location: "Kolkata" },
];

const Customer = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [profileTab, setProfileTab] = useState(""); // "" | "profile" | "orders"
  const [profile, setProfile] = useState({ ...dummyProfile });
  const [editProfile, setEditProfile] = useState({ ...dummyProfile });
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    // Load orders for this customer from localStorage
    const allOrders = JSON.parse(localStorage.getItem("all_customer_orders") || "[]");
    // Optionally, filter by customer email if needed
    // For now, show all orders placed by this customer (by email)
    return allOrders.filter(order => order.customerEmail === (dummyProfile.email || ""));
  });
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [offers, setOffers] = useState([]); // <-- use offers state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    // Simulate fetching offers uploaded by admin (from localStorage or backend)
    // For demo, we use localStorage (set in admin offers component)
    const adminOffers = JSON.parse(localStorage.getItem("admin_offers") || "[]");
    setOffers(adminOffers);
  }, []);

  // Update orders state when order status is changed by branch manager
  useEffect(() => {
    const interval = setInterval(() => {
      const allOrders = JSON.parse(localStorage.getItem("all_customer_orders") || "[]");
      setOrders(allOrders.filter(order => order.customerEmail === (profile.email || "")));
    }, 2000); // Poll every 2 seconds for updates
    return () => clearInterval(interval);
  }, [profile.email]);

  // Close the profile menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfile(false);
        setProfileTab("");
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Simulate profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Password update logic
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
      setPasswordError("");
    }
    setProfile({ ...editProfile });
    setIsEditing(false);
    setShowProfile(false);
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    const found = cart.find((item) => item.id === product.id);
  
    if (found) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      toast.success("Added to cart!");
      setCart((prev) => [...prev, { ...product, qty: 1 }]);
    }
  };
  
  // Remove product from cart
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Find nearest branch by city (simple match for demo)
  const getNearestBranch = (city) => {
    const found = branches.find(
      (b) => b.location.toLowerCase() === city.trim().toLowerCase()
    );
    return found ? found.name : "Central";
  };

  // Modified checkout handler to collect address
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckoutForm(true);
  };

  // Finalize order after address form
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!address || !city || !pincode) {
      toast.error("Please fill all address details.");
      return;
    }
    const branch = getNearestBranch(city);
    const newOrder = {
      id: orders.length + 1,
      date: new Date().toISOString().slice(0, 10),
      items: cart.map((item) => item.title),
      total: cart.reduce((sum, item) => sum + item.qty * item.price, 0),
      status: "Processing",
      address,
      city,
      pincode,
      branch,
      customerName: profile.name || "Customer",
      customerEmail: profile.email || "", // <-- add email for branch manager
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCart(false);
    setProfileTab("orders");
    setShowProfile(true);
    setShowCheckoutForm(false);

    // Save to all_customer_orders in localStorage for branch manager view
    const allOrders = JSON.parse(localStorage.getItem("all_customer_orders") || "[]");
    localStorage.setItem("all_customer_orders", JSON.stringify([newOrder, ...allOrders]));

    // Calculate total products ordered
    const totalProducts = cart.reduce((sum, item) => sum + item.qty, 0);
    setProfile((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + totalProducts * 5,
    }));

    toast.success("Order placed successfully!");
  };

  // Handle feedback submit
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim() === "") return;
    setFeedbacks([{ text: feedback, date: new Date().toLocaleString() }, ...feedbacks]);
    setFeedback("");
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Filter products by category and search
  const filteredProducts = dummyProducts.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Make header fixed */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <CustomerHeader hideHome={true}
          onCartClick={() => {
            setShowCart(true);
            setShowProfile(false);
          }}
          onProfileClick={() => {
            setShowProfile((prev) => !prev);
            setShowCart(false);
            setProfileTab("");
          }}
        />
        {/* Profile dropdown box from logo origin */}
        {showProfile && (
          <div
            ref={profileMenuRef}
            className="absolute right-8 top-4 md:top-6 z-50 bg-white border border-blue-200 rounded-xl shadow-lg w-56"
            style={{
              right: '2.5rem',
              top: '4.5rem',
            }}
          >
            <div className="flex flex-col py-2">
              <button
                className={`px-4 py-3 text-left hover:bg-blue-50 transition rounded-t-xl ${
                  profileTab === "profile" ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => { setProfileTab("profile"); setIsEditing(true); }}
              >
                Update Profile
              </button>
              <button
                className={`px-4 py-3 text-left hover:bg-blue-50 transition rounded-b-xl ${
                  profileTab === "orders" ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => { setProfileTab("orders"); setIsEditing(false); }}
              >
                Order History
              </button>
            </div>
          </div>
        )}
      </div>
      <main className="flex-1 flex relative">
        {/* Sidebar (fixed, goes behind header on scroll) */}
        <div
          className={`transition-all duration-300 bg-white shadow-lg h-[calc(100vh-72px)] py-8 ${
            sidebarExpanded ? "w-48" : "w-16"
          } flex flex-col items-center z-10 fixed left-0 top-[72px]`}
          style={{ zIndex: 10 }}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`flex items-center w-full px-3 py-3 my-1 rounded-lg transition ${
                selectedCategory === cat.name
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-200 text-pink-800"
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="text-xl">{cat.icon}</span>
              <span
                className={`ml-3 font-semibold transition-all duration-200 ${
                  sidebarExpanded ? "opacity-100" : "opacity-0 w-0"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                {sidebarExpanded && cat.name}
              </span>
            </button>
          ))}
          {/* Logout button at the bottom */}
          <div className="flex-1" />
          <button
            className="w-full flex items-center justify-center px-3 py-3 mt-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition font-semibold"
            onClick={() => window.location.href = '/'}
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
        <div className="flex-1 p-6 ml-16 md:ml-48 mt-[72px] flex flex-col md:flex-row gap-8">
          {/* Show Offers section if Offers is selected in sidebar */}
          {selectedCategory === "Offers" ? (
            <div className="flex-1">
              <OffersSection offers={offers} />
            </div>
          ) : (
            // ...existing main content for products, feedback, etc...
            <>
              {/* Left: Product Browsing & Ordering Section */}
              <div className="flex-1">
                {/* Search Bar */}
                {!showCart && (
                  <div className="flex justify-center mb-8">
                    <input
                      type="text"
                      placeholder="Search for cakes, pastries, snacks..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full max-w-md px-4 py-2 border border-pink-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg"
                      style={{ fontFamily: "'Comic Sans MS', cursive" }}
                    />
                  </div>
                )}

                {/* Product Browsing & Ordering Section */}
                {!showCart && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-[#8c2673]">
                      {selectedCategory === "All" ? "Shop Products" : selectedCategory}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="h-full">
                          <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-48 object-cover rounded-md mb-2"
                              loading="lazy"
                            />
                            <div className="flex-1 flex flex-col">
                              <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "'Pacifico', cursive, 'Comic Sans MS', cursive" }}>{product.title}</h3>
                              <p className="text-green-600 font-bold mb-1">₹{product.price}</p>
                              <p className="text-gray-600 text-sm mb-2 flex-1">{product.description}</p>
                            </div>
                            <button
                              className="mt-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white px-6 py-2 rounded-full font-cursive text-lg shadow-lg tracking-wide w-full whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ fontFamily: "'Pacifico', cursive, 'Comic Sans MS', cursive" }}
                              onClick={() => handleAddToCart(product)}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 text-lg mt-8">
                          No products found.
                        </div>
                      )}
                    </div>
                    {/* Feedback and Loyalty Points */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                      {/* Feedback Section */}
                      <div className="bg-green-100 rounded-xl shadow p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
                        <p>Leave feedback about your experience with us.</p>
                        <form onSubmit={handleFeedbackSubmit} className="mt-4 flex flex-col gap-2">
                          <textarea
                            className="p-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                            rows={3}
                            placeholder="Your feedback..."
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            required
                          />
                          <button
                            type="submit"
                            className="self-end bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                          >
                            Submit
                          </button>
                        </form>
                        {/* Show feedbacks */}
                        {feedbacks.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-semibold mb-2 text-green-700">Recent Feedback</h3>
                            <ul className="space-y-2 max-h-32 overflow-y-auto">
                              {feedbacks.map((fb, idx) => (
                                <li key={idx} className="bg-white rounded p-2 shadow text-sm">
                                  <div>{fb.text}</div>
                                  <div className="text-xs text-gray-400 mt-1">{fb.date}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {/* Loyalty Points Section */}
                      <div className="bg-green-100 rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Loyalty Points</h2>
                        <p>Earn and track loyalty points with every purchase.</p>
                        <div className="mt-2 text-lg font-bold text-green-700">
                          Current Points: {profile.loyaltyPoints}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Cart Section */}
                {showCart && !showCheckoutForm && (
                  <Cart
                    cart={cart}
                    onCheckout={handleCheckout}
                    onRemove={handleRemoveFromCart}
                  />
                )}
                {/* Checkout Address Form */}
                {showCart && showCheckoutForm && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                        onClick={() => setShowCheckoutForm(false)}
                        title="Close"
                      >
                        &times;
                      </button>
                      <h2 className="text-2xl font-bold mb-4 text-blue-700">Enter Delivery Details</h2>
                      <form onSubmit={handlePlaceOrder} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <input
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Pincode</label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Place Order
                          </button>
                          <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            onClick={() => setShowCheckoutForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {/* Profile/OrderHistory Section as Modal Form */}
          {showProfile && profileTab === "profile" && isEditing && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={() => { setShowProfile(false); setIsEditing(false); setPassword(""); setConfirmPassword(""); setPasswordError(""); }}
                  title="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Update Profile</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editProfile.name}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editProfile.email}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={editProfile.mobile}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  {/* Password fields */}
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                  </div>
                  {passwordError && (
                    <div className="text-red-600 text-sm">{passwordError}</div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      onClick={() => { setIsEditing(false); setShowProfile(false); setPassword(""); setConfirmPassword(""); setPasswordError(""); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Order History Modal */}
          {showProfile && profileTab === "orders" && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={() => { setShowProfile(false); setProfileTab(""); }}
                  title="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Order History</h2>
                <OrderHistory orders={orders} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Customer;
