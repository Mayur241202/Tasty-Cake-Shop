import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerHeader from "../components/customerHeader";
import Card from "../components/card";
import ProductCard from "../components/productCard";
import Cart from "../components/cart";
import OrderHistory from "../components/orderHistory";
import OffersSection from "../components/offersSection"; // <-- import offers section
import LoyaltyProgram from "../components/loyaltyProgram";
import { toast } from "react-toastify";
import API_BASE_URL from '../config';

// Dummy data for demonstration
const dummyOrdersInit = [
  { id: 1, date: "2025-04-01", items: ["Chocolate Cake", "Cupcake"], total: 350, status: "Delivered" },
  { id: 2, date: "2025-04-10", items: ["Red Velvet Cake"], total: 500, status: "Processing" },
];

const dummyProfile = {
  firstName: "Ketan",
  lastName: "Jedhe",
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
  { id: 4, name: "South", location: "Ahmedabad" },
];

const Customer = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [profileTab, setProfileTab] = useState(""); // "" | "profile" | "orders"
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    loyaltyPoints: 0
  });
  const [editProfile, setEditProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    loyaltyPoints: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [cart, setCart] = useState([]);
  const [branchesData, setBranchesData] = useState(branches); // Add state for branches
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [offers, setOffers] = useState([]); // <-- use offers state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [cities, setCities] = useState([]); // <-- cities dropdown
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(0); // Points to redeem
  const [useReward, setUseReward] = useState(false); // Toggle to use reward
  const profileMenuRef = useRef(null);
  
  // Authentication check - runs only once on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      navigate("/login");
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (userData.role !== "customer") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, []);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setProfile({
            firstName: userData.firstname,
            lastName: userData.lastname,
            email: userData.email,
            mobile: userData.mobile,
            loyaltyPoints: userData.loyaltyPoints || 0
          });
          setEditProfile({
            firstName: userData.firstname,
            lastName: userData.lastname,
            email: userData.email,
            mobile: userData.mobile,
            loyaltyPoints: userData.loyaltyPoints || 0
          });
        } else if (response.status === 401 || response.status === 403) {
          console.warn("Token invalid or expired");
          // Don't redirect here - just log the warning
          // The user can still use cached data
        } else {
          console.error("Failed to fetch user profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Network error - don't log out the user
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Fetch cities/branches from backend API
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/branches`);
        const fetchedBranches = await response.json();
        // Update branches data with real data from backend
        setBranchesData(fetchedBranches);
        // Extract unique cities from branches
        const uniqueCities = [...new Set(fetchedBranches.map(branch => branch.location))];
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    // Fetch offers from backend API
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/offers`);
        const data = await response.json();
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  // Fetch products from backend (all branches)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();
        // Transform backend products to match frontend format
        const transformedProducts = data.map((product, index) => ({
          id: product._id || index,
          title: product.name,
          price: product.price,
          category: product.type,
          description: `${product.quantity} ${product.unit} available`,
          image: product.image ? `${API_BASE_URL}${product.image}` : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
          quantity: product.quantity,
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch orders from MongoDB and feedbacks
  useEffect(() => {
    const fetchOrdersAndFeedbacks = async () => {
      if (!profile.email) return;
      
      try {
        setLoadingOrders(true);
        // Fetch customer orders
        const ordersResponse = await fetch(`${API_BASE_URL}/api/orders/all`);
        if (ordersResponse.ok) {
          const allOrders = await ordersResponse.json();
          setOrders(allOrders.filter(order => order.customerEmail === profile.email));
        }
        
        // Fetch customer feedbacks
        const feedbackResponse = await fetch(`${API_BASE_URL}/api/feedback/customer/${profile.email}`);
        if (feedbackResponse.ok) {
          const allFeedbacks = await feedbackResponse.json();
          setFeedbacks(allFeedbacks.map(fb => ({
            _id: fb._id,
            text: fb.text,
            date: new Date(fb.createdAt).toLocaleString()
          })));
        }
      } catch (error) {
        console.error("Error fetching orders and feedbacks:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchOrdersAndFeedbacks();
    
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchOrdersAndFeedbacks, 5000);
    return () => clearInterval(interval);
  }, [profile.email]);

  // Close the profile menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if clicking on the modal (fixed position element)
      if (event.target.closest(".profile-modal")) {
        return;
      }
      
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
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Password update logic
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
      setPasswordError("");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const updateData = {
        firstname: editProfile.firstName,
        lastname: editProfile.lastName,
        email: editProfile.email,
        mobile: editProfile.mobile
      };

      if (password) {
        updateData.password = password;
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile({
          firstName: updatedUser.firstname,
          lastName: updatedUser.lastname,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          loyaltyPoints: updatedUser.loyaltyPoints || 0
        });
        setEditProfile({
          firstName: updatedUser.firstname,
          lastName: updatedUser.lastname,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          loyaltyPoints: updatedUser.loyaltyPoints || 0
        });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setShowProfile(false);
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    const selectedQty = product.selectedQty || 1;
    const found = cart.find((item) => item.id === product.id);
  
    if (found) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + selectedQty } : item
        )
      );
    } else {
      toast.success(`Added ${selectedQty} item(s) to cart!`);
      setCart((prev) => [...prev, { ...product, qty: selectedQty }]);
    }
  };
  
  // Remove product from cart
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Find nearest branch by city (simple match for demo)
  const getNearestBranch = (city) => {
    const found = branchesData.find(
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
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!address || !city || !pincode) {
      toast.error("Please fill all address details.");
      return;
    }
    
    // Address validation: must be at least 10 characters
    if (address.trim().length < 10) {
      toast.error("Address must be at least 10 characters long.");
      return;
    }
    
    // Address validation: should only contain letters, numbers, spaces, and common punctuation
    if (!/^[a-zA-Z0-9\s,./\-#&]*$/.test(address)) {
      toast.error("Address contains invalid characters.");
      return;
    }
    
    // Pincode validation: must be exactly 6 digits
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be exactly 6 digits.");
      return;
    }

    // Validate points redemption
    const pointsToRedeem = useReward ? Math.min(redeemPoints, profile.loyaltyPoints || 0) : 0;
    if (useReward && redeemPoints < 1000 && redeemPoints > 0) {
      toast.error("Minimum 1000 points required to redeem. You have " + (profile.loyaltyPoints || 0) + " points.");
      return;
    }

    const branch = getNearestBranch(city);
    let cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const discountAmount = Math.floor(pointsToRedeem / 1000); // 1000 points = ₹1 discount
    const finalTotal = Math.max(0, cartTotal - discountAmount); // Ensure total doesn't go below 0

    const newOrder = {
      id: orders.length + 1,
      date: new Date().toISOString().slice(0, 10),
      items: cart.map((item) => ({ title: item.title, price: item.price, qty: item.qty })),
      total: finalTotal,
      status: "Processing",
      address,
      city,
      pincode,
      branch,
      customerName: `${profile.firstName} ${profile.lastName}` || "Customer",
      customerEmail: profile.email || "",
      pointsRedeemed: pointsToRedeem,
      originalTotal: cartTotal,
      discount: discountAmount
    };

    try {
      // Save order to MongoDB via API
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newOrder)
      });

      if (!response.ok) {
        throw new Error("Failed to save order to database");
      }

      const savedOrder = await response.json();
      
      setOrders([savedOrder, ...orders]);
      setCart([]);
      setShowCart(false);
      setProfileTab("orders");
      setShowProfile(true);
      setShowCheckoutForm(false);
      setRedeemPoints(0);
      setUseReward(false);

      // Show order confirmation with loyalty info
      if (pointsToRedeem > 0) {
        toast.success(`Order placed! ₹${discountAmount} discount applied from ${pointsToRedeem} loyalty points.`);
      } else {
        toast.success("Order placed successfully!");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  // Handle feedback submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim() === "") return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerEmail: profile.email,
          customerName: `${profile.firstName} ${profile.lastName}`,
          text: feedback,
          rating: 5
        })
      });

      if (response.ok) {
        const newFeedback = await response.json();
        setFeedbacks([{
          _id: newFeedback._id,
          text: newFeedback.text,
          date: new Date(newFeedback.createdAt).toLocaleString()
        }, ...feedbacks]);
        setFeedback("");
        toast.success("Thank you for your feedback!");
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
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
                className={`px-4 py-3 text-left hover:bg-blue-50 transition ${
                  profileTab === "orders" ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => { setProfileTab("orders"); setIsEditing(false); }}
              >
                Order History
              </button>
              <button
                className={`px-4 py-3 text-left hover:bg-blue-50 transition rounded-b-xl ${
                  profileTab === "loyalty" ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => { setProfileTab("loyalty"); setIsEditing(false); }}
              >
                🎁 Loyalty Program
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
                    {loadingProducts ? (
                      <div className="text-center text-gray-500 py-8">
                        Loading products...
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="h-full">
                          <ProductCard 
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                      ))}
                      {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 text-lg mt-8">
                          No products found.
                        </div>
                      )}
                    </div>
                    )}
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
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                        onClick={() => setShowCart(false)}
                        title="Close cart"
                      >
                        ×
                      </button>
                      <Cart
                        cart={cart}
                        onCheckout={handleCheckout}
                        onRemove={handleRemoveFromCart}
                        onBack={() => setShowCart(false)}
                      />
                    </div>
                  </div>
                )}
                {/* Checkout Address Form */}
                {showCart && showCheckoutForm && (
                  <div 
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
                    onClick={() => setShowCheckoutForm(false)}
                  >
                    <div 
                      className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative"
                      onClick={e => e.stopPropagation()}
                    >
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
                            placeholder="e.g., 123 Main St, Apartment 4B"
                            className={`w-full p-2 border rounded ${
                              address && address.trim().length < 10 ? "border-red-500" : "border-gray-300"
                            }`}
                            required
                          />
                          {address && address.trim().length < 10 && (
                            <p className="text-red-500 text-xs mt-1">Address must be at least 10 characters</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <select
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                          >
                            <option value="">Select a city</option>
                            {cities.map((cityName, index) => (
                              <option key={index} value={cityName}>
                                {cityName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Pincode</label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={e => {
                              // Only allow digits and limit to 6 characters
                              const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                              setPincode(value);
                            }}
                            placeholder="e.g., 110001"
                            maxLength="6"
                            className={`w-full p-2 border rounded ${
                              pincode && pincode.length !== 6 ? "border-red-500" : "border-gray-300"
                            }`}
                            required
                          />
                          {pincode && pincode.length !== 6 && (
                            <p className="text-red-500 text-xs mt-1">Pincode must be exactly 6 digits</p>
                          )}
                          {pincode && pincode.length === 6 && (
                            <p className="text-green-500 text-xs mt-1">✓ Valid pincode</p>
                          )}
                        </div>

                        {/* Loyalty Points Redemption */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={useReward}
                              onChange={(e) => {
                                setUseReward(e.target.checked);
                                if (!e.target.checked) setRedeemPoints(0);
                              }}
                              className="w-4 h-4 text-purple-600"
                            />
                            <span className="font-semibold text-gray-800">
                              🎁 Use Loyalty Points ({profile?.loyaltyPoints || 0} available)
                            </span>
                          </label>
                          
                          {useReward && (
                            <div className="mt-3 space-y-2">
                              <input
                                type="number"
                                min="0"
                                max={profile?.loyaltyPoints || 0}
                                value={redeemPoints}
                                onChange={(e) => setRedeemPoints(Math.max(0, Math.min(parseInt(e.target.value) || 0, profile?.loyaltyPoints || 0)))}
                                placeholder="Enter points to redeem"
                                className="w-full p-2 border border-purple-300 rounded text-sm"
                              />
                              <div className="text-sm text-gray-600">
                                <p>Redeeming: <span className="font-bold text-purple-600">{redeemPoints} points</span></p>
                                <p>Discount: <span className="font-bold text-green-600">₹{Math.floor(redeemPoints / 1000)}</span></p>
                                {redeemPoints > 0 && redeemPoints < 1000 && (
                                  <p className="text-red-500 mt-1">⚠️ Minimum 1000 points required to redeem</p>
                                )}
                              </div>
                            </div>
                          )}
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
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
              onClick={() => { setShowProfile(false); setIsEditing(false); setPassword(""); setConfirmPassword(""); setPasswordError(""); }}
            >
              <div 
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative profile-modal"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={() => { setShowProfile(false); setIsEditing(false); setPassword(""); setConfirmPassword(""); setPasswordError(""); }}
                  title="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Update Profile</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editProfile.firstName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editProfile.lastName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
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
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowProfile(false);
                  setProfileTab("");
                }
              }}
            >
              <div 
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile(false);
                    setProfileTab("");
                  }}
                  title="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Order History</h2>
                <OrderHistory orders={orders} />
              </div>
            </div>
          )}
          {/* Loyalty Program Modal */}
          {showProfile && profileTab === "loyalty" && (
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowProfile(false);
                  setProfileTab("");
                }
              }}
            >
              <div 
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile(false);
                    setProfileTab("");
                  }}
                  title="Close"
                >
                  &times;
                </button>
                <LoyaltyProgram 
                  profile={profile} 
                  onClose={() => {
                    setShowProfile(false);
                    setProfileTab("");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Customer;
