# 🍰 Tasty Cake Shop - Multi-Role Management System

A comprehensive web application for managing a multi-branch cake shop with different user roles, inventory management, staff management, and customer interactions.

---

## 🌐 Live Application

🔗 **Visit the live application:** [https://tasty-cake-shop.onrender.com](https://tasty-cake-shop.onrender.com)

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [User Roles & Permissions](#user-roles--permissions)
- [Interview Preparation Guide](#interview-preparation-guide)

---

## 🎯 Project Overview

**Tasty Cake Shop** is a full-stack web application designed to manage operations across multiple cake shop branches. The application supports three distinct user roles:

1. **Customers** - Browse products, place orders, view offers
2. **Branch Managers** - Manage inventory, staff, and analyze branch-specific data
3. **Admin** - Oversee all branches, manage users, create system-wide offers

This is an ideal portfolio project demonstrating:
- Multi-role authentication and authorization
- RESTful API design
- Real-time dashboard analytics
- Role-based access control
- Database relationships and data modeling
- Frontend state management with React Router
- Responsive UI with Tailwind CSS

---

## 💻 Tech Stack

### Frontend
- **React 19** - UI library with functional components and hooks
- **Vite** - Modern build tool for fast development
- **React Router v7** - Client-side routing for multi-page navigation
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Recharts** - Data visualization library for charts and analytics
- **React Toastify** - Toast notifications for user feedback
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixes

### Backend
- **Node.js & Express.js v5** - Server runtime and web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB with schema validation
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcrypt/Bcryptjs** - Password hashing for security
- **CORS** - Cross-origin resource sharing for frontend-backend communication
- **Multer** - Middleware for handling file uploads (offer images)
- **Dotenv** - Environment variable management

---

## 🏗️ Project Architecture

```
FRONTEND (Vite + React)
├── Pages (Home, Login, Signup, Customer, Admin, Branch Manager)
├── Components (Header, Footer, Card, Cart, Analytics)
└── State Management (React Context + URL params)
        ↓ (HTTP Requests via Axios)
BACKEND (Express.js + Node.js)
├── Routes (Auth, Branches, Staff, Offers, Users)
├── Controllers (Business Logic)
├── Middlewares (Auth verification, Error handling)
└── Models (User, Branch, Staff, Offer)
        ↓ (Queries)
DATABASE (MongoDB)
├── Users Collection
├── Branches Collection
├── Staff Collection
└── Offers Collection
```

---

## ✨ Features

### For Customers
- **User Authentication** - Secure registration and login with JWT tokens
- **Product Browsing** - Browse all available cakes and products with detailed information
- **Shopping Cart** - Add/remove items and manage quantities before checkout
- **Order Placement** - Place orders with delivery address validation (minimum 10 characters)
- **Pincode Validation** - Ensure valid 6-digit delivery pincode for accurate delivery
- **Order Tracking** - View real-time order status (Pending, Processing, Delivered, Cancelled)
- **Order History** - Access expandable order cards showing detailed purchase information
- **Loyalty Points System**
  - Earn 1 point per ₹1 spent (automatic)
  - Redeem 1000 points = ₹1 discount at checkout
  - Minimum 1000 points required for redemption
  - Real-time points balance display
  - Complete transaction history with dates
  - Visual loyalty program dashboard with benefits
- **Feedback System** - Submit 1-5 star ratings with detailed comments about orders
- **Offers & Promotions** - View seasonal promotions and special offers
- **Profile Management** - Update personal information and view account details
- **Real-time Notifications** - Get instant order status updates via WebSocket
- **Responsive Design** - Seamless experience on mobile, tablet, and desktop

### For Branch Managers
- **Branch-Specific Dashboard** - Access only their assigned branch's data
- **Inventory Management**
  - View all products in inventory
  - Check stock levels and product details
  - Track product availability by branch
- **Staff Management**
  - Add new staff members
  - View all staff assigned to their branch
  - Update staff information
  - Delete staff records
- **Orders Analysis**
  - View branch-specific orders in real-time
  - Track order status and fulfillment
  - Filter orders by status and date
  - Real-time notifications for new orders with audio alerts
- **Branch Analytics**
  - Sales performance dashboard
  - Order statistics and trends
  - Staff performance metrics
  - Revenue charts with Recharts
- **Feedback Management**
  - View all feedback submitted for their branch
  - Filter feedback by star rating (1-5 stars)
  - See customer satisfaction metrics
  - Delete inappropriate feedback
  - View feedback statistics (average rating, total count, satisfaction %)
- **Real-time Notifications** - Instant alerts for new orders via Socket.io

### For Admin
- **User Management**
  - View all registered users
  - Search and filter users by role
  - Deactivate/delete user accounts
  - Monitor user registration and activity
- **Branch Management**
  - Create new branches across locations
  - Update branch information
  - View branch-wise analytics
  - Delete branches if needed
- **System-wide Offers**
  - Create promotions for all or specific branches
  - Set offer validity periods (From/To dates)
  - Upload attractive offer images
  - Schedule offers in advance
  - Manage existing offers
- **Product Management**
  - View all products across branches
  - Add new products to system
  - Update product pricing and details
  - Manage product categories
  - Track inventory levels
- **Staff Management**
  - View all staff across branches
  - Search staff by name, role, or branch
  - Monitor staff information and contact details
- **Admin Analytics Dashboard**
  - System-wide sales performance
  - Revenue trends and metrics
  - Customer statistics
  - Order fulfillment analytics
  - Branch-wise performance comparison
  - Charts and data visualization with Recharts
- **Feedback Management**
  - View all customer feedback across all branches
  - Filter feedback by star rating and branch
  - See customer satisfaction metrics
  - Delete inappropriate feedback
  - Identify feedback trends and patterns
  - Export feedback reports
- **Loyalty Points Overview** - Monitor loyalty program usage and redemption patterns

### System Features
- **Authentication & Security**
  - Secure JWT-based authentication with token storage
  - Password hashing with bcrypt (10 salt rounds)
  - Role-based access control (RBAC)
  - Protected API routes with token verification
  - Secure logout functionality
- **Real-time Updates**
  - WebSocket-based Socket.io for instant notifications
  - Real-time order status updates to customers and branch managers
  - Audio alerts for new orders
  - Live dashboard data refresh
- **Loyalty Program**
  - Automatic point allocation on order completion
  - Point transaction history and audit trail
  - Real-time balance tracking
  - Discount calculation: `Math.floor(points / 1000)`
  - Transaction logging for accountability
- **Feedback System**
  - Star-based rating system (1-5 stars)
  - Text feedback submission
  - Branch-specific feedback tracking
  - Feedback statistics and analytics
  - Easy feedback deletion for management
- **Data Persistence**
  - MongoDB for reliable data storage
  - Mongoose schema validation
  - Data relationships and references
  - Automatic timestamps for all records
- **File Management**
  - Multer for image uploads
  - Offer image storage and serving
  - File validation and error handling
- **User Interface**
  - Tailwind CSS responsive design
  - Mobile-first approach
  - Toast notifications for feedback (React Toastify)
  - Modal dialogs for complex operations
  - Professional card layouts
  - Interactive charts and graphs
- **API Features**
  - RESTful endpoint design
  - Consistent response formatting
  - Comprehensive error handling
  - CORS support for frontend-backend communication
  - Request validation and sanitization

---

## 📊 Database Schema

### User Model
```
{
  firstname: String (required),
  lastname: String (required),
  email: String (required, unique, indexed),
  mobile: String,
  password: String (required, hashed with bcrypt),
  role: Enum["admin", "branchmanager", "customer"],
  branch: String (required for branch managers, specifies assigned branch),
  loyaltyPoints: Number (default 0, tracks earned points),
  createdAt: Date (default: now)
}
```

### Order Model
```
{
  customerName: String (required),
  customerEmail: String (required, indexed),
  items: Array[
    {
      id: ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      image: String
    }
  ],
  address: String (required, minimum 10 characters for validation),
  city: String (required),
  pincode: String (required, exactly 6 digits),
  total: Number (required),
  discountApplied: Number (from loyalty points redemption),
  pointsRedeemed: Number (points used for discount),
  finalTotal: Number (total after discount),
  branch: String (assigned branch),
  status: Enum["Pending", "Processing", "Delivered", "Cancelled"],
  date: Date (default: now),
  createdAt: Date (default: now)
}
```

### Loyalty Transaction Model (NEW)
```
{
  customerEmail: String (required, indexed),
  points: Number (required, amount of points),
  type: Enum["earn", "redeem"] (type of transaction),
  reason: String (required, e.g., "Order completed", "Discount redeemed"),
  orderId: ObjectId (reference to Order, optional),
  balanceBefore: Number (points before transaction),
  balanceAfter: Number (points after transaction),
  createdAt: Date (default: now, indexed for sorting)
}
```

### Feedback Model
```
{
  customerEmail: String (required, indexed),
  customerName: String (required),
  text: String (required, feedback content),
  rating: Number (1-5, default 5, required),
  branch: String (default "All Branches", specifies which branch feedback is for),
  createdAt: Date (default: now, indexed for sorting)
}
```

### Branch Model
```
{
  name: String (required, unique),
  location: String (required),
  createdAt: Date (default: now)
}
```

### Staff Model
```
{
  name: String (required),
  role: String (required, e.g., "Baker", "Manager", "Delivery"),
  contact: String (required, phone number),
  branch: String (required, reference to Branch),
  createdBy: ObjectId (reference to User who created the record),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated on modification)
}
```

### Product Model
```
{
  name: String (required),
  type: String (category, required),
  price: Number (required),
  quantity: Number (stock level),
  unit: String (e.g., "kg", "piece"),
  image: String (product image path),
  branch: String (assigned to specific branch),
  createdAt: Date (default: now)
}
```

### Offer Model
```
{
  title: String (required),
  file: String (image filename),
  filePath: String (path to uploaded image),
  branch: String (default "all", scope of offer),
  validFrom: Date (start date),
  validTo: Date (end date),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

### Database Indexes (Recommended)
```javascript
// User.js
userSchema.index({ email: 1 });          // Fast login queries
userSchema.index({ role: 1, branch: 1 }); // Filter by role and branch

// Order.js
orderSchema.index({ customerEmail: 1 }); // Customer order history
orderSchema.index({ branch: 1 });        // Branch-specific orders
orderSchema.index({ date: -1 });         // Latest orders first

// Loyalty Transaction Model
transactionSchema.index({ customerEmail: 1 }); // Customer transaction history
transactionSchema.index({ createdAt: -1 });    // Latest transactions first

// Feedback Model
feedbackSchema.index({ customerEmail: 1 }); // Customer feedback lookup
feedbackSchema.index({ branch: 1 });        // Branch-specific feedback
feedbackSchema.index({ rating: 1 });        // Filter by rating

// Staff.js
staffSchema.index({ branch: 1 });        // Branch staff lookup

// Offer.js
offerSchema.index({ branch: 1 });        // Branch-specific offers
offerSchema.index({ validFrom: 1, validTo: 1 }); // Active offers query
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/signup` - Register new user
  - Request: `{ firstname, lastname, email, mobile, password, role }`
  - Response: User object with JWT token
- `POST /api/auth/login` - Login user
  - Request: `{ email, password }`
  - Response: User object with JWT token
- `POST /api/auth/logout` - Logout user
  - Request: None
  - Response: Success message

### Profile Routes (`/api/profile`)
- `GET /api/profile` - Get user profile (protected route)
  - Headers: `Authorization: Bearer <token>`
  - Response: User profile with all details
- `PUT /api/profile` - Update user profile (protected route)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ firstname, lastname, mobile }`
  - Response: Updated user object

### Orders Routes (`/api/orders`)
- `POST /api/orders/create` - Create new order (protected)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ customerName, customerEmail, items, address, city, pincode, total, branch, pointsRedeemed }`
  - Response: Order object with ID
  - Side Effects: 
    - Awards loyalty points (1 point per ₹1)
    - Deducts redeemed points from user balance
    - Creates LoyaltyTransaction records
    - Broadcasts Socket.io event to branch room
- `GET /api/orders` - Get all orders (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of order objects
- `GET /api/orders/:orderId` - Get specific order details (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Single order object
- `PUT /api/orders/:orderId/status` - Update order status (protected, admin/manager only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ status }`
  - Response: Updated order object
  - Emits: Socket.io event to notify customer

### Loyalty Routes (`/api/loyalty`)
- `GET /api/loyalty/balance` - Get current loyalty points balance (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ email, points, nextDiscountAt }`
  - Calculation: `nextDiscountAt = Math.ceil(points / 1000) * 1000`
- `GET /api/loyalty/history` - Get transaction history (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of last 50 transactions with details
  - Each transaction includes: `{ customerEmail, points, type, reason, orderId, balanceBefore, balanceAfter, createdAt }`
- `GET /api/loyalty/info` - Get loyalty program details (public)
  - Response: Program details, benefits, earning and redemption rates
  - Benefits:
    - Earn: 1 point per ₹1 spent
    - Redeem: 1000 points = ₹1 discount
    - Minimum: 1000 points required

### Feedback Routes (`/api/feedback`)
- `POST /api/feedback/create` - Submit feedback (protected)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ customerEmail, customerName, text, rating, branch }`
  - Response: Feedback object with ID
  - Validation: Rating must be 1-5
- `GET /api/feedback/all` - Get all feedbacks (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of all feedback objects
  - Includes: Customer name, email, rating, text, branch, date
- `GET /api/feedback/customer/:email` - Get customer's own feedbacks (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of feedback submitted by this customer
- `GET /api/feedback/branch/:branchName` - Get branch-specific feedbacks (protected, managers/admin)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of feedback for specified branch
  - Managers can only access their own branch
- `DELETE /api/feedback/:feedbackId` - Delete feedback (protected, admin/manager)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Branches Routes (`/api/branches`)
- `GET /api/branches` - Get all branches (public)
  - Response: Array of all branch objects
- `POST /api/branches` - Create new branch (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ name, location }`
  - Response: New branch object
- `GET /api/branches/:id` - Get branch details (public)
  - Response: Single branch object
- `PUT /api/branches/:id` - Update branch (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ name, location }`
  - Response: Updated branch object
- `DELETE /api/branches/:id` - Delete branch (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Staff Routes (`/api/staff`)
- `GET /api/staff` - Get all staff (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of staff objects (filtered by manager's branch if not admin)
- `POST /api/staff` - Add new staff member (protected)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ name, role, contact, branch }`
  - Response: New staff object
- `GET /api/staff/:id` - Get staff details (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Single staff object
- `PUT /api/staff/:id` - Update staff (protected)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ name, role, contact, branch }`
  - Response: Updated staff object
- `DELETE /api/staff/:id` - Delete staff (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Admin User Routes (`/api/admin/users`)
- `GET /api/admin/users` - Get all users (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of user objects
- `POST /api/admin/users` - Create user (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ firstname, lastname, email, mobile, password, role, branch }`
  - Response: New user object
- `PUT /api/admin/users/:id` - Update user (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ firstname, lastname, mobile, role, branch }`
  - Response: Updated user object
- `DELETE /api/admin/users/:id` - Delete user (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Products Routes (`/api/products`)
- `GET /api/products` - Get all products (public)
  - Response: Array of all product objects
- `POST /api/products` - Add new product (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ name, type, price, quantity, unit, branch }`
  - Response: New product object
- `GET /api/products/:id` - Get product details (public)
  - Response: Single product object
- `PUT /api/products/:id` - Update product (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ name, type, price, quantity, unit }`
  - Response: Updated product object
- `DELETE /api/products/:id` - Delete product (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Offers Routes (`/api/offers`)
- `GET /api/offers` - Get all active offers (public)
  - Response: Array of offer objects filtered by date
- `POST /api/offers` - Create new offer (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ title, branch, validFrom, validTo, file (multipart) }`
  - Response: New offer object with file path
- `GET /api/offers/:id` - Get offer details (public)
  - Response: Single offer object
- `PUT /api/offers/:id` - Update offer (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ title, branch, validFrom, validTo, file (optional) }`
  - Response: Updated offer object
- `DELETE /api/offers/:id` - Delete offer (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Socket.io Events (Real-time)
**Client to Server:**
- `joinBranch` - Join branch-specific notification room
  - Data: `{ branch }`

**Server to Client:**
- `newOrder` - Broadcast when order is created
  - Data: `{ orderId, customerName, total, branch, timestamp }`
- `orderStatusUpdate` - Notify customer of status change
  - Data: `{ orderId, status, timestamp }`
- `notification` - General notification event
  - Data: `{ message, type }`

---

## 📁 Project Structure

```
Tasty-Cake-Shop/
├── Frontend (Root)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.jsx                    # Landing page with product grid
│   │   │   ├── login.jsx                   # User login form
│   │   │   ├── signup.jsx                  # User registration form
│   │   │   ├── customer.jsx                # Customer dashboard (1143 lines)
│   │   │   │                               # Features: shopping, cart, checkout, 
│   │   │   │                               # order history, loyalty points, feedback
│   │   │   ├── admin.jsx                   # Admin landing/role selection
│   │   │   ├── adminDashboard.jsx          # Admin main interface with tabs
│   │   │   │                               # Tabs: Analysis, Users, Branches, Offers, Feedback
│   │   │   ├── branchManagerDashboard.jsx  # Branch manager interface with tabs
│   │   │   │                               # Tabs: Inventory, Staff, Orders, Feedback
│   │   │   ├── branchmanager.jsx           # Branch manager role selection
│   │   │   ├── about.jsx                   # About page
│   │   │   └── contact.jsx                 # Contact page
│   │   ├── components/
│   │   │   ├── header.jsx                  # Navigation header (role-based)
│   │   │   ├── footer.jsx                  # Footer component
│   │   │   ├── card.jsx                    # Product card display
│   │   │   ├── productCard.jsx             # Alternative product card
│   │   │   ├── cart.jsx                    # Shopping cart modal
│   │   │   ├── offersSection.jsx           # Offers carousel/section
│   │   │   ├── orderHistory.jsx            # Order history modal with expandable cards
│   │   │   ├── customerHeader.jsx          # Customer-specific header
│   │   │   ├── loyaltyProgram.jsx          # Loyalty dashboard (NEW)
│   │   │   │                               # Shows: points balance, redemption value,
│   │   │   │                               # transaction history, benefits
│   │   │   ├── admin/
│   │   │   │   ├── analysis.jsx            # Admin analytics dashboard
│   │   │   │   │                           # Charts: sales, orders, revenue
│   │   │   │   ├── users.jsx               # User management interface
│   │   │   │   ├── branches.jsx            # Branch management interface
│   │   │   │   ├── offers.jsx              # Offer management with uploads
│   │   │   │   └── feedback.jsx            # Admin feedback dashboard (NEW)
│   │   │   │                               # Features: view all feedbacks, filter by rating,
│   │   │   │                               # stats, delete inappropriate feedback
│   │   │   └── branchManager/
│   │   │       ├── inventoryManagement.jsx # Product inventory view
│   │   │       ├── staffManagement.jsx     # Staff CRUD operations
│   │   │       ├── ordersAnalysis.jsx      # Branch order analytics
│   │   │       └── feedback.jsx            # Branch-specific feedback (NEW)
│   │   │                                   # Shows only branch's feedback
│   │   ├── App.jsx                         # Main App component with routing
│   │   ├── App.css                         # App-level styles
│   │   ├── main.jsx                        # Vite entry point
│   │   ├── index.css                       # Global styles
│   │   └── assets/                         # Images, icons, static assets
│   ├── public/                             # Static files
│   ├── package.json                        # Frontend dependencies
│   ├── vite.config.js                      # Vite configuration
│   ├── tailwind.config.js                  # Tailwind CSS configuration
│   ├── postcss.config.js                   # PostCSS configuration
│   ├── eslint.config.js                    # ESLint rules
│   └── index.html                          # HTML entry point
│
└── cake-shop-backend/
    ├── server.js                           # Express server entry point (port 5000)
    │                                       # Routes: auth, profile, branches, staff,
    │                                       # admin/users, offers, products, orders,
    │                                       # feedback, loyalty
    │                                       # Middleware: CORS, auth verification
    │                                       # Socket.io: real-time notifications
    ├── package.json                        # Backend dependencies
    ├── .env                                # Environment variables
    ├── .gitignore                          # Ignored files
    ├── config/
    │   └── db.js                           # MongoDB connection configuration
    ├── models/
    │   ├── User.js                         # User schema with loyaltyPoints field
    │   ├── Order.js                        # Order schema with pointsRedeemed field
    │   ├── Feedback.js                     # Feedback schema with branch field
    │   ├── LoyaltyTransaction.js           # Transaction tracking (NEW)
    │   ├── Branch.js                       # Branch schema
    │   ├── Staff.js                        # Staff schema
    │   ├── Product.js                      # Product schema
    │   └── Offer.js                        # Offer schema
    ├── routes/
    │   ├── auth.js                         # Authentication: signup, login, logout
    │   ├── profile.js                      # Profile: get, update
    │   ├── branches.js                     # Branch: CRUD operations
    │   ├── staff.js                        # Staff: CRUD operations
    │   ├── adminUsers.js                   # Admin user management
    │   ├── offers.js                       # Offer: CRUD + file upload
    │   ├── products.js                     # Product: CRUD operations
    │   ├── orders.js                       # Order: create, get, update status
    │   │                                   # Integrates loyalty points awarding
    │   ├── feedback.js                     # Feedback: create, get, delete (NEW)
    │   │                                   # Features: branch filtering, stats
    │   └── loyalty.js                      # Loyalty: balance, history, info (NEW)
    ├── middlewares/                        # Custom middleware (if any)
    └── uploads/
        ├── offers/                         # Uploaded offer images
        └── products/                       # Uploaded product images
```

### Key Files Detail

**Frontend Key Files:**
- [customer.jsx](src/pages/customer.jsx) - 1143 lines covering entire customer workflow
- [adminDashboard.jsx](src/pages/adminDashboard.jsx) - Admin interface with feedback tab
- [branchManagerDashboard.jsx](src/pages/branchManagerDashboard.jsx) - Manager interface with feedback tab
- [loyaltyProgram.jsx](src/components/loyaltyProgram.jsx) - Loyalty dashboard (NEW)
- [admin/feedback.jsx](src/components/admin/feedback.jsx) - Admin feedback management (NEW)
- [branchManager/feedback.jsx](src/components/branchManager/feedback.jsx) - Manager feedback (NEW)

**Backend Key Files:**
- [server.js](cake-shop-backend/server.js) - Express setup with all routes and Socket.io
- [models/User.js](cake-shop-backend/models/User.js) - Added loyaltyPoints field
- [models/Feedback.js](cake-shop-backend/models/Feedback.js) - Added branch field
- [models/LoyaltyTransaction.js](cake-shop-backend/models/LoyaltyTransaction.js) - NEW transaction tracking
- [routes/orders.js](cake-shop-backend/routes/orders.js) - Order creation with points awarding
- [routes/loyalty.js](cake-shop-backend/routes/loyalty.js) - NEW loyalty endpoints
- [routes/feedback.js](cake-shop-backend/routes/feedback.js) - Feedback with branch filtering

---

## 👥 User Roles & Permissions

| Feature | Customer | Branch Manager | Admin |
|---------|----------|----------------|-------|
| View Products | ✅ | ✅ | ✅ |
| Place Orders | ✅ | ❌ | ❌ |
| View Profile | ✅ | ✅ | ✅ |
| Manage Inventory | ❌ | ✅ | ✅ |
| Manage Staff | ❌ | ✅ | ✅ |
| View Branch Analytics | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Manage Branches | ❌ | ❌ | ✅ |
| Create Offers | ❌ | ❌ | ✅ |
| View System Analytics | ❌ | ❌ | ✅ |

---

## � Loyalty Points System (NEW)

### Overview
The loyalty program encourages repeat purchases by awarding points for every rupee spent and allowing customers to redeem points for discounts.

### Program Details
- **Earning Rate**: 1 loyalty point per ₹1 spent
- **Redemption Rate**: 1000 loyalty points = ₹1 discount
- **Minimum Redemption**: 1000 points required
- **Discount Calculation**: `discount = Math.floor(redeemPoints / 1000)`
- **Example**: 
  - Spend ₹5000 → Earn 5000 points
  - Redeem 3000 points → Get ₹3 discount
  - Max 2000 points left for next purchase

### Customer Workflow
1. Customer places order for ₹500
   - 500 points automatically awarded
   - Points visible in profile
2. At checkout of next order:
   - Option to redeem points
   - Can enter 1000+ points
   - Real-time discount calculation displayed
   - Final total = order amount - discount
   - Points deducted after order confirmation
3. View transaction history:
   - Complete loyalty dashboard in customer page
   - All earn/redeem transactions listed
   - Transaction dates and order references
   - Running balance before/after each transaction

### Transaction Tracking
Each transaction is recorded with:
- Customer email (indexed for fast lookup)
- Points amount (positive for earn, negative for redeem)
- Transaction type (earn/redeem)
- Reason (Order completed, Discount redeemed, etc.)
- Order ID reference (optional)
- Balance before transaction
- Balance after transaction
- Timestamp

### API Integration

**Awarding Points on Order:**
```javascript
// In orders.js route
const earnedPoints = orderTotal; // 1 point per rupee
user.loyaltyPoints += earnedPoints;

// Create transaction record
new LoyaltyTransaction({
  customerEmail: order.customerEmail,
  points: earnedPoints,
  type: "earn",
  reason: "Order completed",
  orderId: order._id,
  balanceBefore: previousBalance,
  balanceAfter: user.loyaltyPoints,
  createdAt: new Date()
}).save();
```

**Redeeming Points at Checkout:**
```javascript
// Validate and deduct
if (redeemPoints < 1000) throw error("Minimum 1000 points");
if (redeemPoints > user.loyaltyPoints) throw error("Insufficient points");

user.loyaltyPoints -= redeemPoints;
const discount = Math.floor(redeemPoints / 1000);

// Record redemption
new LoyaltyTransaction({
  type: "redeem",
  reason: "Discount redeemed at checkout",
  points: redeemPoints,
  orderId: order._id,
  balanceBefore: previousBalance,
  balanceAfter: user.loyaltyPoints
}).save();
```

### Frontend Implementation

**Checkout Loyalty Section:**
```jsx
const [useReward, setUseReward] = useState(false);
const [redeemPoints, setRedeemPoints] = useState(0);
const pointsToRedeem = useReward ? Math.min(redeemPoints, profile.loyaltyPoints) : 0;
const discountAmount = Math.floor(pointsToRedeem / 1000); // 1000 points = ₹1
const finalTotal = Math.max(0, cartTotal - discountAmount);
```

**Loyalty Dashboard:**
- Large card showing current point balance
- Redemption value (points / 1000 = discount)
- Program benefits with visual indicators
- Complete transaction history (last 50 transactions)
- Earn transactions (green) vs Redeem transactions (red)
- Date-based filtering and sorting

---

## 💬 Feedback & Rating System (NEW)

### Overview
The feedback system collects customer reviews and ratings to help improve service and monitor customer satisfaction.

### Features
- **Star Rating**: 1-5 stars based on customer satisfaction
- **Text Feedback**: Detailed comments from customers
- **Branch Tracking**: Feedback linked to specific branch (multi-branch support)
- **Statistics**: Average rating, satisfaction percentage, total count
- **Filtering**: View feedback by rating level
- **Management**: Delete inappropriate feedback

### Customer Feedback Submission
1. After order completion, customer can submit feedback
2. Select 1-5 star rating (required)
3. Add optional text comment
4. Feedback auto-associated with order and branch
5. Confirmation message displayed

### Admin Feedback Dashboard
**Features:**
- View all feedbacks across all branches
- Statistics cards:
  - Total feedback count
  - Average rating (with ⭐ display)
  - Satisfaction percentage = (5⭐ + 4⭐ feedback) / total * 100
- Filter buttons for each rating (5⭐ through 1⭐, All)
- Each feedback displays:
  - Customer name and email
  - Star rating with visual indicator
  - Feedback text
  - Branch name
  - Submission date
  - Delete button
- Professional card layout with hover effects

### Branch Manager Feedback Dashboard
**Features:**
- View feedbacks for assigned branch only
- Same statistics and filtering as admin
- Filtered endpoint: `GET /api/feedback/branch/:branchName`
- Manager cannot see other branches' feedback
- Helps managers identify branch-specific issues
- Branch name displayed in header

### Database Schema
```javascript
{
  customerEmail: String (indexed),
  customerName: String,
  text: String,
  rating: Number (1-5),
  branch: String,
  createdAt: Date (indexed)
}
```

### API Endpoints

**Create Feedback:**
```
POST /api/feedback/create
Headers: Authorization: Bearer <token>
Body: {
  customerEmail: "customer@email.com",
  customerName: "John Doe",
  text: "Great cakes, fast delivery!",
  rating: 5,
  branch: "Downtown"
}
Response: { _id, customerEmail, rating, createdAt }
```

**Get All Feedbacks (Admin):**
```
GET /api/feedback/all
Headers: Authorization: Bearer <token>
Response: [
  {
    _id, customerEmail, customerName, text, rating, branch, createdAt
  },
  ...
]
```

**Get Branch Feedbacks:**
```
GET /api/feedback/branch/:branchName
Headers: Authorization: Bearer <token>
Response: [filtered feedbacks for branch]
```

**Delete Feedback:**
```
DELETE /api/feedback/:feedbackId
Headers: Authorization: Bearer <token>
Response: { success: true, message: "Feedback deleted" }
```

### Real-World Usage Examples

**Scenario 1: Quality Improvement**
- Admin reviews 1-2⭐ feedback
- Identifies consistency issues at specific branch
- Takes corrective action

**Scenario 2: Recognition**
- Manager sees 5⭐ feedback consistently
- Recognizes team performance
- Celebrates with staff

**Scenario 3: Service Monitoring**
- Branch manager receives instant notification of feedback
- Can respond to negative feedback quickly
- Improves customer relationships

---

## �🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Step 1: Clone and Navigate
```bash
cd "c:\Users\mayur\Desktop\Semester 6 All\Tasty-Cake-Shop-main"
```

### Step 2: Backend Setup
```bash
cd cake-shop-backend

# Install dependencies
npm install

# Create/verify .env file with:
MONGO_URI=mongodb://localhost:27017/TastyCakeShop
JWT_SECRET=mySuperSecretKey123!
PORT=5000

# Start MongoDB (if local)
mongod

# Start backend server
node server.js
# Server runs on http://localhost:5000
```

### Step 3: Frontend Setup (New Terminal)
```bash
# From root directory
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Access Application
- **Home Page:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/*

### Build for Production
```bash
# Frontend
npm run build    # Creates optimized build in dist/

# Backend
# Deploy as Node.js application or containerize with Docker
```

---

## 🔐 Authentication Flow

1. User registers → Password hashed with bcrypt → Stored in MongoDB
2. User logs in → Credentials verified → JWT token generated
3. Token stored in localStorage (frontend)
4. Token sent in Authorization header for protected routes
5. Backend verifies JWT → Routes check user role → Access granted/denied

---

## ⚙️ Configuration

### Environment Variables (.env)
Located in `cake-shop-backend/.env`:

```
MONGO_URI=mongodb://localhost:27017/TastyCakeShop  # MongoDB connection string
JWT_SECRET=mySuperSecretKey123!                     # Secret key for signing JWT tokens
PORT=5000                                           # Backend server port
```

**For Production:**
- Use MongoDB Atlas instead of local MongoDB
- Generate a strong JWT_SECRET (at least 32 characters)
- Use environment-specific values

---

## 🔄 Data Flow & Interactions

### Customer Order Flow
1. Customer browses products on home/customer page
2. Selects items and adds to cart
3. Proceeds to checkout
4. Order is saved in database
5. Customer can view order history

### Offer Management Flow
1. Admin creates offer with title, image, date range, and branch scope
2. Offer image uploaded via Multer (stored in uploads/offers)
3. Offer data saved to MongoDB
4. Customers see active offers on frontend
5. Offers filtered by branch if specific to location

### Staff Management Flow
1. Branch Manager logs in
2. Views staff assigned to their branch
3. Can add/edit/delete staff members
4. Staff records linked to branch via MongoDB reference
5. Manager can view staff analytics/performance

---

## 🛠️ Key Implementation Details

### Authentication Mechanism
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Token-based JWT**: Stored in localStorage on frontend
- **Token Verification**: Checked on every protected route
- **Auth Middleware**: Validates Bearer token in Authorization header
- **Role Verification**: Routes check user role after token validation

### Real-time Updates with Socket.io
- **Connection**: Client connects on app load
- **Branch Room**: Customers/managers join branch-specific room on login
- **Events**:
  - `newOrder`: Broadcast when order created (to branch manager)
  - `orderStatusUpdate`: Notify customer of status change
  - `notification`: General messages
- **Audio Alerts**: New order sound plays for branch managers
- **Fallback**: REST API polling if WebSocket unavailable

### Loyalty Points Implementation
- **Auto-Award**: Points awarded immediately on order creation
- **Rate**: 1 point per ₹1 = 1 point per rupee spent
- **Storage**: `User.loyaltyPoints` field (Number, indexed)
- **Transactions**: Recorded in `LoyaltyTransaction` model with audit trail
- **Redemption**: 
  - Minimum 1000 points required
  - Redeemable only at checkout
  - Discount = `Math.floor(points / 1000)`
  - Deducted after order confirmation
- **Validation**: 
  - Prevent double-spending (compare against DB balance)
  - Ensure points don't go negative
  - Check minimum threshold

### Feedback System Implementation
- **Model**: Separate `Feedback` collection with indexes
- **Branch Field**: Links feedback to specific branch for filtering
- **Timestamps**: Auto-created `createdAt` for sorting
- **Stats Calculation**:
  - Average: `feedbacks.reduce((sum, f) => sum + f.rating, 0) / count`
  - Satisfaction: `(count of 4-5⭐) / total * 100`
- **Filtering**: 
  - All feedbacks (admin only, all branches)
  - Branch-specific (manager, own branch only)
  - By rating (admin/manager can filter each rating)
- **Soft Delete**: Option to delete inappropriate feedback

### Form Validations
- **Delivery Address**: Minimum 10 characters (prevent "123")
  - Validation: `address.trim().length < 10` → error
- **Pincode**: Exactly 6 digits for Indian postal system
  - Validation: `/^\d{6}$/.test(pincode)` → valid
- **Loyalty Points**: Minimum 1000 points to redeem
  - Validation: `redeemPoints < 1000` → error
- **Feedback Rating**: 1-5 scale (enforced on backend)
  - Validation: `rating >= 1 && rating <= 5`

### Modal Event Propagation Fix
- **Problem**: Clicking inside expanded order details closed entire modal
- **Solution**: Applied `onClick={e => e.stopPropagation()}` to:
  - Overlay/backdrop (only closes on direct click)
  - Modal wrapper (prevents bubble-up)
  - Order card (prevents modal close)
  - Expanded details (prevents modal close)
- **Result**: Modal stays open during interaction

### Database Relationships
- **User → Order**: One user to many orders (customerEmail FK)
- **User → LoyaltyTransaction**: One user to many transactions (customerEmail FK)
- **Order → LoyaltyTransaction**: One order to one/multiple transactions (orderId FK)
- **Feedback → Branch**: Many feedbacks to one branch (branch name string)
- **User → Branch**: Branch manager assigned to specific branch
- **Staff → Branch**: Staff member linked to branch
- **All with timestamps**: createdAt, updatedAt for audit trails

### Role-Based Access Control
**Three-tier access:**
1. **Database Layer**: Mongoose schema validation
2. **API Layer**: Express middleware checks role
3. **Frontend Layer**: Conditional rendering based on `user.role`

**Enforcement:**
```javascript
// Backend route example
router.post('/admin/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // ... create user
});

// Frontend example
{user.role === 'admin' && <AdminDashboard />}
{user.role === 'branchmanager' && <ManagerDashboard />}
{user.role === 'customer' && <CustomerDashboard />}
```

### File Upload System
- **Middleware**: Multer configured for form-data
- **Storage**: Local filesystem in `uploads/offers/`
- **Validation**: 
  - Check file type (images only)
  - Limit file size (< 5MB)
  - Unique filename with timestamp
- **Serving**: Express static middleware at `/uploads`
- **Production Consideration**: Use cloud storage (AWS S3, Cloudinary)

### Data Persistence & Backup
- **MongoDB Atlas**: Remote database for reliability
- **Connections**: Mongoose connection pooling
- **Transactions**: Database operations with error handling
- **Indexing**: Optimized queries on frequently accessed fields
- **Timestamps**: All records have audit trail dates

---

## 🔐 Security Considerations

### Current Implementation
✅ **Password Security**: Bcrypt hashing with salt rounds  
✅ **JWT Authentication**: Token-based with Bearer scheme  
✅ **CORS Protection**: Configured for frontend-backend communication  
✅ **Input Validation**: Email, pincode, address validation  
✅ **Role-Based Access**: Three-tier access control  
✅ **Database Indexes**: Fast query lookups  
✅ **Error Handling**: No sensitive data leaked in errors  

### Recommended Enhancements for Production
- [ ] **Rate Limiting**: Implement express-rate-limit on auth routes
- [ ] **HTTPS/SSL**: Use certificates in production
- [ ] **Input Sanitization**: Use express-validator for all inputs
- [ ] **CSRF Protection**: Add csrf-protection middleware
- [ ] **Helmet**: Use helmet for security headers
- [ ] **Refresh Tokens**: Implement token rotation
- [ ] **Environment Secrets**: Use AWS Secrets Manager or similar
- [ ] **Request Validation**: Schema validation with joi or zod
- [ ] **Audit Logging**: Log all sensitive operations
- [ ] **2FA**: Two-factor authentication for admin accounts
- [ ] **API Keys**: Version your API with api-key validation
- [ ] **OWASP**: Follow OWASP top 10 guidelines

## 🚀 Performance Optimization Tips

### Frontend Optimization
- Lazy load route components with `React.lazy()`
- Implement code splitting with Vite dynamic imports
- Use `React.memo()` for expensive components (feedback lists, analytics)
- Optimize images (WebP format, lazy loading with Intersection Observer)
- Cache API responses with custom hooks or React Query
- Implement pagination for large lists (orders, feedbacks, staff)
- Virtualization for long lists (react-window for 1000+ items)

### Backend Optimization
- Add database indexes on frequently queried fields
- Use `select()` in Mongoose to exclude unnecessary fields
- Implement caching layer (Redis) for:
  - User profile data (30 min TTL)
  - Loyalty points balance (5 min TTL)
  - Active offers (1 hour TTL)
- Pagination for all list endpoints (default 20 items per page)
- Use aggregation pipeline for analytics (MongoDB native functions)
- Connection pooling (Mongoose default)

### Database Optimization
- **Essential Indexes**:
  - User: `{ email: 1 }` (login queries)
  - Order: `{ customerEmail: 1 }` (order history)
  - Order: `{ branch: 1 }` (branch-specific orders)
  - LoyaltyTransaction: `{ customerEmail: 1 }` (point lookup)
  - LoyaltyTransaction: `{ createdAt: -1 }` (latest first)
  - Feedback: `{ branch: 1 }` (branch filtering)
  - Feedback: `{ rating: 1 }` (filter by stars)
  - Staff: `{ branch: 1 }` (branch staff lookup)
- Archive old orders and transactions (partition by year)
- Use MongoDB aggregation for analytics instead of processing in app

### Real-time Optimization
- Socket.io connection pooling (use adapter for multiple servers)
- Compress Socket.io messages
- Limit event broadcasting scope (branch-specific rooms)
- Implement message queuing for high-volume events

---

## ⚠️ Troubleshooting & Common Issues

### MongoDB Issues
**Problem**: "Cannot connect to MongoDB"
```
Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGO_URI in .env is correct
3. For MongoDB Atlas: 
   - Verify IP whitelist includes your IP
   - Check credentials in connection string
   - Ensure database exists
```

**Problem**: "Duplicate key error on email"
```
Solution:
1. Email already exists - user already registered
2. Check user exists in database: db.users.find({email: "..."})
3. Clear test data if needed: db.users.deleteMany({email: "test@test.com"})
```

### CORS & Authentication
**Problem**: "Access to XMLHttpRequest blocked by CORS"
```
Solution:
1. Verify CORS middleware enabled in server.js:
   app.use(cors({ origin: "http://localhost:5173" }));
2. Check both frontend and backend are running
3. Verify correct API endpoint in frontend
```

**Problem**: "Authentication failed" / "Invalid token"
```
Solution:
1. Check token is sent in Authorization header: 
   Authorization: Bearer <token>
2. Verify JWT_SECRET in .env matches server
3. Clear localStorage and re-login:
   localStorage.removeItem('token');
4. Check token hasn't expired
```

### Loyalty Points Issues
**Problem**: "Loyalty points not updating after order"
```
Solution:
1. Verify order was created successfully (check MongoDB)
2. Check if points were deducted from redeemPoints:
   - Query: db.users.findOne({email: "..."}).loyaltyPoints
3. Verify LoyaltyTransaction record exists:
   - Query: db.loyaltytransactions.find({customerEmail: "..."})
4. Check console for JavaScript errors in browser
5. Restart backend server (clear cache)
```

**Problem**: "Cannot redeem points - error message"
```
Solution:
1. Ensure minimum 1000 points: Current = Math.floor(points / 1000)
2. Check loyalty points balance is correct in profile
3. Verify transaction was recorded in database
4. Check order total is correct (points = rupees)
5. Validate no concurrent redeeming (race condition)
```

### Feedback Issues
**Problem**: "Feedback not appearing in admin dashboard"
```
Solution:
1. Verify feedback was created (check MongoDB):
   db.feedbacks.find({customerEmail: "..."})
2. Check branch name matches exactly (case-sensitive)
3. Refresh admin dashboard (F5)
4. Verify user has admin role:
   db.users.findOne({email: "admin@..."}).role
5. Check browser console for API errors
```

**Problem**: "Branch manager can't see branch feedback"
```
Solution:
1. Verify manager's branch matches feedback branch (exact match)
2. Check manager's assigned branch in User model:
   db.users.findOne({email: "..."}).branch
3. Feedback branch field value:
   db.feedbacks.find({_id: ObjectId("...")}).branch
4. Re-login as manager (refresh token)
5. Check manager role is "branchmanager" (typo check)
```

### Real-time Notifications
**Problem**: "Not receiving new order notifications"
```
Solution:
1. Check Socket.io connection:
   - Open DevTools → Network → WS
   - Should show active WebSocket connection
2. Verify branch manager is logged in and in branch-specific room
3. Check server console: new order should print socket emit
4. Verify branch name matches in order and Socket.io event
5. Try refreshing branch manager dashboard
6. Check firewall isn't blocking WebSocket on port 5000
```

**Problem**: "Audio notification not playing"
```
Solution:
1. Check browser hasn't muted sound (right-click tab → Mute/Unmute)
2. Verify audio file exists: `/public/notification.mp3`
3. Check browser console for audio errors
4. Test with simple audio:
   new Audio('/notification.mp3').play();
5. Check CORS for audio file
```

### Form Validation Issues
**Problem**: "Pincode rejected as invalid"
```
Solution:
1. Must be exactly 6 digits: /^\d{6}$/.test(pincode)
2. Remove spaces: pincode.trim()
3. For Indian addresses only (assumed by app)
4. Examples: 110001 (valid), 1100-01 (invalid), 11000 (invalid - 5 digits)
```

**Problem**: "Address validation error"
```
Solution:
1. Address must be at least 10 characters: address.trim().length >= 10
2. Remove extra spaces: address.trim()
3. Examples: "123 Street" (9 chars - invalid), "123 Main Street" (14 chars - valid)
4. Should include: street number, name, city, landmarks
```

### Port & Connection Issues
**Problem**: "Port 5000 already in use" / "EADDRINUSE"
```
Solution:
Windows:
1. Find process: netstat -ano | findstr :5000
2. Kill process: taskkill /PID <PID> /F

Mac/Linux:
1. Find process: lsof -i :5000
2. Kill process: kill -9 <PID>

Or change port in .env: PORT=5001
```

**Problem**: "Cannot reach http://localhost:5000"
```
Solution:
1. Verify backend is running: 
   - Terminal should show "Server running on port 5000"
2. Check you're using localhost (not 127.0.0.1 inconsistently)
3. Verify API URL in frontend matches: 
   axios.defaults.baseURL = "http://localhost:5000/api"
4. Check no firewall blocking port 5000
5. Restart backend with: npm install && node server.js
```

---

## 📚 Frontend Components Architecture

### Page Components
- **home.jsx**: Landing page with product showcase
- **login.jsx**: User authentication form
- **signup.jsx**: User registration with email validation
- **customer.jsx** (1143 lines): Complete customer interface
  - Shopping cart with add/remove items
  - Checkout with address and pincode validation
  - Loyalty points redemption (≥1000 points)
  - Order history with expandable cards
  - Feedback submission (1-5 stars)
  - Real-time order status tracking
- **adminDashboard.jsx**: Admin control center
  - Tabs: Analysis, Users, Branches, Offers, Feedback
  - Role-based UI rendering
- **branchManagerDashboard.jsx**: Manager interface
  - Tabs: Inventory, Staff, Orders, Feedback
  - Branch-specific data filtering
- **about.jsx, contact.jsx**: Static pages

### Reusable Components
- **header.jsx**: Navigation (role-aware)
- **footer.jsx**: Site footer
- **card.jsx, productCard.jsx**: Product display
- **cart.jsx**: Shopping cart modal
- **offersSection.jsx**: Promotional displays
- **orderHistory.jsx**: Order list modal
- **loyaltyProgram.jsx** (NEW): Points dashboard
- **admin/feedback.jsx** (NEW): Admin feedback management
- **branchManager/feedback.jsx** (NEW): Manager feedback view

### Admin Sub-components
- **analysis.jsx**: Analytics dashboard with Recharts
  - Sales trends, order statistics, revenue
- **users.jsx**: User management interface
- **branches.jsx**: Branch CRUD operations
- **offers.jsx**: Promotional offer management
- **feedback.jsx** (NEW): Feedback dashboard
  - Filter by rating, view statistics, delete feedback

### Branch Manager Sub-components
- **inventoryManagement.jsx**: Product stock view
- **staffManagement.jsx**: Staff CRUD operations
- **ordersAnalysis.jsx**: Order metrics and trends
- **feedback.jsx** (NEW): Branch-specific feedback view

---

## 🎓 Future Enhancement Ideas

### Phase 2 Features
- [ ] **Payment Integration**: Stripe/PayPal for online payments
- [ ] **Email Notifications**: Order confirmation and status emails
- [ ] **SMS Alerts**: WhatsApp/SMS for order updates
- [ ] **Customer Reviews**: Detailed product reviews with images
- [ ] **Wishlist**: Save favorite products for later
- [ ] **Coupon System**: Admin-created discount codes
- [ ] **Inventory Alerts**: Notify when stock is low
- [ ] **Dynamic Pricing**: Price adjustments based on demand
- [ ] **Multi-language**: Support for multiple languages
- [ ] **Customer Support**: Chat system for inquiries

### Technical Improvements
- [ ] **Unit Tests**: Jest for component testing
- [ ] **Integration Tests**: Test API endpoints
- [ ] **API Documentation**: Swagger/OpenAPI specs
- [ ] **GraphQL**: Alternative to REST API
- [ ] **Microservices**: Split into independent services
- [ ] **Docker**: Containerization for deployment
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Performance Monitoring**: Track response times
- [ ] **Error Tracking**: Sentry for error logging
- [ ] **Analytics**: Google Analytics integration

## 📦 Dependencies Overview

### Frontend Dependencies
| Package | Purpose | Version |
|---------|---------|---------|
| react | UI library | 19.0.0 |
| react-router-dom | Client-side routing | 7.5.1 |
| axios | HTTP client | 1.8.4 |
| tailwindcss | CSS framework | 3.4.17 |
| recharts | Data visualization | 2.13.4 |
| react-toastify | Toast notifications | 10.0.5 |
| socket.io-client | WebSocket client | 4.8.1 |
| vite | Build tool | 5.4.11 |
| postcss | CSS processing | 8.4.47 |
| autoprefixer | Vendor prefixes | 10.4.20 |

### Backend Dependencies
| Package | Purpose | Version |
|---------|---------|---------|
| express | Web framework | 5.1.0 |
| mongoose | MongoDB ODM | 8.13.2 |
| jsonwebtoken | JWT handling | 9.0.2 |
| bcryptjs | Password hashing | 2.4.3 |
| cors | Cross-origin resource sharing | 2.8.5 |
| multer | File upload middleware | 1.4.5 |
| dotenv | Environment variables | 16.3.1 |
| socket.io | Real-time communication | 4.8.1 |
| nodemon | Auto-reload (dev) | 3.1.7 |

### Installation
```bash
# Frontend dependencies
cd Tasty-Cake-Shop
npm install

# Backend dependencies
cd cake-shop-backend
npm install

# Install globally (optional)
npm install -g nodemon  # For development auto-reload
```

---

## 🧪 Testing the Application

### Test Credentials

**Admin Account:**
```
Email: admin@cake.com
Password: admin123
Access: All features, all branches
```

**Branch Manager Account:**
```
Email: manager@cake.com
Password: manager123
Assigned Branch: Downtown (or verify in database)
Access: Branch-specific inventory, staff, orders, feedback
```

**Customer Accounts:**
```
Email: customer@cake.com
Password: customer123
Access: Browse products, place orders, loyalty points, feedback

Email: john@example.com
Password: john123
Access: Same as above
```

### Test Workflows

**Loyalty Points Test:**
1. Login as customer
2. Place order with ₹500+ total
3. Check profile → should show loyalty points
4. Place another order, use points at checkout
5. Verify discount calculated: `Math.floor(points / 1000)`
6. Check Loyalty Dashboard for transaction history

**Feedback Test:**
1. Customer submits 4⭐ feedback with comment
2. Admin dashboard → Feedback tab
3. Should show feedback with all details
4. Filter by 4⭐ - feedback appears
5. Branch manager dashboard → Feedback
6. Manager sees only their branch's feedback

**Real-time Order Test:**
1. Customer place order
2. Open admin/manager dashboard
3. New order notification appears (with audio if not muted)
4. Update order status
5. Customer sees status change (Socket.io event)

**Form Validation Test:**
1. Address field: Try entering less than 10 characters → Error
2. Pincode field: Try non-6-digit values → Error
3. Loyalty redemption: Try less than 1000 points → Error

---

## 📊 Project Statistics

### Code Metrics
- **Frontend Components**: 15+ JSX files
- **Backend Routes**: 8 route files (~500 lines total)
- **Database Models**: 8 models with relationships
- **API Endpoints**: 40+ endpoints (RESTful)
- **Lines of Code**: ~5000+ lines total
- **Database Collections**: 8 (User, Order, Feedback, LoyaltyTransaction, Branch, Staff, Product, Offer)

### Feature Coverage
- ✅ **Authentication**: JWT-based, role-based access
- ✅ **Multi-role Support**: 3 user types (customer, manager, admin)
- ✅ **E-commerce**: Products, cart, orders, checkout
- ✅ **Loyalty Program**: Earn/redeem points, transaction tracking
- ✅ **Feedback System**: Ratings, management, branch filtering
- ✅ **Real-time**: Socket.io notifications, live updates
- ✅ **Analytics**: Charts, dashboards, metrics
- ✅ **File Upload**: Offer images, file management
- ✅ **Validation**: Form validation, business logic validation

---

## 🌟 Key Highlights

### What Makes This Project Stand Out

1. **Complete Full-Stack Implementation**
   - Professional MERN-like architecture
   - Demonstrates mastery of both frontend and backend
   - Production-ready code with error handling

2. **Real-time Architecture**
   - Socket.io integration for instant notifications
   - Live order tracking and status updates
   - Professional notification system with audio alerts

3. **Comprehensive Loyalty Program**
   - Professional point system (1:1000 ratio)
   - Complete transaction audit trail
   - Prevents fraud with validation and balance checks

4. **Robust Feedback System**
   - Multi-branch support with filtering
   - Statistical analysis (average rating, satisfaction %)
   - Admin and manager-specific views

5. **Professional UI/UX**
   - Responsive design with Tailwind CSS
   - Modal event propagation fixes for smooth interaction
   - Professional charts and analytics with Recharts
   - Role-specific dashboards

6. **Database Design**
   - Proper relationships and references
   - Optimized with strategic indexes
   - Audit trails with timestamps
   - Scalable schema for multi-branch operations

7. **Security Practices**
   - Bcrypt password hashing
   - JWT token-based authentication
   - Role-based access control at multiple layers
   - Input validation and sanitization

---

## 🚀 Running the Project

### Quick Start (5 minutes)

```bash
# Terminal 1 - Backend Setup
cd cake-shop-backend
npm install
node server.js
# Output: Server running on port 5000

# Terminal 2 - Frontend Setup (new terminal)
cd ..
npm install
npm run dev
# Output: VITE v5.4.11 ready in 123 ms
# Open http://localhost:5173 in browser
```

### Using Test Credentials
1. Open http://localhost:5173
2. Click "Sign In"
3. Use customer@cake.com / customer123
4. Explore features: order, earn loyalty points, submit feedback
5. Logout and login as admin@cake.com / admin123
6. View all feedbacks and analytics

---

## 📝 Key Learning Outcomes

This project demonstrates expertise in:

**Frontend:**
✅ React hooks and functional components  
✅ React Router for multi-page apps  
✅ Component composition and reusability  
✅ State management with useState/useContext  
✅ API integration with Axios  
✅ Real-time WebSocket communication  
✅ Responsive design with Tailwind CSS  
✅ Form handling and validation  
✅ Data visualization with Recharts  
✅ Error handling and user feedback  

**Backend:**
✅ Express.js RESTful API design  
✅ MongoDB and Mongoose ODM  
✅ JWT authentication and authorization  
✅ Password hashing with Bcrypt  
✅ Role-based access control  
✅ Database schema design  
✅ API validation and error handling  
✅ File upload with Multer  
✅ Real-time communication with Socket.io  
✅ Environmental configuration management  

**Full-Stack:**
✅ Complete CRUD operations  
✅ Client-server communication  
✅ Database transactions and relationships  
✅ Multi-branch architecture  
✅ Scalable application design  
✅ Professional code organization  
✅ Security best practices  
✅ Performance optimization  
✅ Testing and debugging  
✅ Documentation and comments  

---

## 📞 Support & Troubleshooting

### Need Help?
1. **Check Logs**: Browser console (Frontend) and terminal (Backend)
2. **MongoDB Shell**: Inspect database directly
   ```bash
   mongosh  # Enter MongoDB shell
   use TastyCakeShop
   db.users.find()  # View all users
   db.orders.find()  # View all orders
   ```
3. **Network Tab**: Check API requests in DevTools → Network
4. **Socket.io**: Check WebSocket connection in DevTools → Network → WS
5. **Review Code**: Check relevant route or component

### Common Fixes
- **Clear Cache**: `Ctrl+Shift+Delete` (browser cache)
- **Clear Storage**: `localStorage.clear()` in console
- **Restart Servers**: Kill and restart both terminals
- **Check .env**: Verify MongoDB URI and JWT_SECRET

---

## 📜 License

This project is created for educational and portfolio purposes.

### Attribution
- **Framework**: React (Meta)
- **Backend**: Express.js (OpenJS Foundation)
- **Database**: MongoDB (MongoDB Inc.)
- **UI Framework**: Tailwind CSS
- **Icons & Assets**: Based on project requirements

---

## 🎯 Career Value

This project is excellent for:
- **Resume Enhancement**: Demonstrates full-stack capability
- **Portfolio**: Complete working application to showcase
- **Interview Preparation**: Covers MERN concepts comprehensively
- **Learning**: Practical implementation of industry patterns
- **Deployment**: Ready to deploy to production platforms
  - Frontend: Vercel, Netlify, AWS S3
  - Backend: Heroku, Railway, AWS EC2
  - Database: MongoDB Atlas (already used)

---

**Last Updated**: December 2024  
**Version**: 2.0 (With Loyalty Points & Feedback System)  
**Status**: Production-Ready ✅

---

*Enjoy using Tasty Cake Shop! For questions or improvements, refer to the code comments and this documentation.*
