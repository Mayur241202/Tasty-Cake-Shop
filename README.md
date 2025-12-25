# 🍰 Tasty Cake Shop - Multi-Role Management System

A comprehensive web application for managing a multi-branch cake shop with different user roles, inventory management, staff management, and customer interactions.

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
- User registration and login
- Browse available cakes and products
- View special offers and promotions
- Place and track orders
- View order history
- Profile management
- Responsive mobile-friendly interface

### For Branch Managers
- Login to manage their assigned branch
- Inventory management dashboard
- Staff management (add, view, update staff)
- Orders analysis and performance metrics
- View branch-specific analytics
- Manage offers for their branch

### For Admin
- User management (view, manage customers and managers)
- Branch management (create/manage multiple branches)
- System-wide offers creation and scheduling
- Analytics dashboard across all branches
- Monitor all staff and inventory
- Generate business insights

### System Features
- Secure JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- File upload support for offer images
- Real-time data visualization
- User-friendly error handling with toast notifications

---

## 📊 Database Schema

### User Model
```
{
  firstname: String,
  lastname: String,
  email: String (unique),
  mobile: String,
  password: String (hashed),
  role: Enum["admin", "branchmanager", "customer"],
  branch: String (required for branch managers)
}
```

### Branch Model
```
{
  name: String,
  location: String
}
```

### Staff Model
```
{
  name: String,
  role: String,
  contact: String,
  branch: Reference to Branch,
  createdBy: Reference to User,
  timestamps: true
}
```

### Offer Model
```
{
  title: String,
  fileName: String,
  filePath: String,
  branch: String (default: "all"),
  fromDate: String,
  toDate: String,
  timestamps: true
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Profile Routes (`/api/profile`)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Branches Routes (`/api/branches`)
- `GET /api/branches` - Get all branches
- `POST /api/branches` - Create new branch (admin only)
- `GET /api/branches/:id` - Get branch details
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch

### Staff Routes (`/api/staff`)
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add new staff member
- `GET /api/staff/:id` - Get staff details
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Admin User Routes (`/api/admin/users`)
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Offers Routes (`/api/offers`)
- `GET /api/offers` - Get all offers
- `POST /api/offers` - Create new offer (admin only)
- `GET /api/offers/:id` - Get offer details
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer
- `POST /api/offers/upload` - Upload offer image

---

## 📁 Project Structure

```
Tasty-Cake-Shop/
├── Frontend (Root)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.jsx              # Landing page
│   │   │   ├── login.jsx             # User login
│   │   │   ├── signup.jsx            # User registration
│   │   │   ├── customer.jsx          # Customer dashboard
│   │   │   ├── admin.jsx             # Admin dashboard
│   │   │   ├── adminDashboard.jsx    # Admin main interface
│   │   │   ├── branchManagerDashboard.jsx  # Manager dashboard
│   │   │   ├── about.jsx             # About page
│   │   │   └── contact.jsx           # Contact page
│   │   ├── components/
│   │   │   ├── header.jsx            # Navigation header
│   │   │   ├── footer.jsx            # Footer component
│   │   │   ├── card.jsx              # Product card
│   │   │   ├── cart.jsx              # Shopping cart
│   │   │   ├── offersSection.jsx     # Offers display
│   │   │   ├── orderHistory.jsx      # Order history
│   │   │   ├── admin/
│   │   │   │   ├── analysis.jsx      # Analytics component
│   │   │   │   ├── branches.jsx      # Branch management
│   │   │   │   ├── offers.jsx        # Offer management
│   │   │   │   └── users.jsx         # User management
│   │   │   └── branchManager/
│   │   │       ├── inventoryManagement.jsx
│   │   │       ├── ordersAnalysis.jsx
│   │   │       └── staffManagement.jsx
│   │   ├── App.jsx                   # Main App component with routing
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.css                   # App styles
│   │   └── index.css                 # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
└── cake-shop-backend/
    ├── server.js                     # Express server entry point
    ├── package.json
    ├── .env                          # Environment variables
    ├── config/
    │   └── db.js                     # MongoDB connection
    ├── models/
    │   ├── User.js                   # User schema
    │   ├── Branch.js                 # Branch schema
    │   ├── Staff.js                  # Staff schema
    │   └── Offer.js                  # Offer schema
    ├── routes/
    │   ├── auth.js                   # Authentication endpoints
    │   ├── profile.js                # Profile endpoints
    │   ├── branches.js               # Branch endpoints
    │   ├── staff.js                  # Staff endpoints
    │   ├── offers.js                 # Offer endpoints
    │   └── adminUsers.js             # Admin user management
    ├── middlewares/                  # Custom middleware (auth, error handling)
    └── uploads/
        └── offers/                   # Uploaded offer images
```

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

## 🚀 Installation & Setup

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
- Password hashing: Bcrypt (10 salt rounds)
- Token-based: JWT stored in localStorage
- Token expiry: Configurable in JWT_SECRET
- Protected routes: Backend verifies token before allowing access

### File Upload System
- Middleware: Multer for handling multipart/form-data
- Storage: Local filesystem in `uploads/offers/`
- Served: Via Express static middleware at `/uploads`
- In production: Consider using cloud storage (AWS S3, Cloudinary)

### Database Relationships
- **User → Branch**: Branch manager assigned to specific branch
- **Staff → Branch**: Staff member linked to branch via reference
- **Staff → User**: Staff created by (tracks who created the record)
- **Offer → Branch**: Offer can be for all branches or specific branch

### Role-Based Access Control
- Admin: Can access all features and all data
- Branch Manager: Can only access their assigned branch data
- Customer: Can only view public offerings and own data
- Enforced at: Backend route handlers + Frontend UI conditionals

---

## 📱 Frontend Components Architecture

### Page Components
- **Home**: Landing page with navigation
- **Login/Signup**: Authentication pages
- **Customer**: Main customer dashboard with orders and offers
- **AdminDashboard**: Central admin hub with sub-sections
- **BranchManagerDashboard**: Manager's branch-specific interface
- **About/Contact**: Static information pages

### Reusable Components
- **Header**: Navigation bar (changes based on user role)
- **Footer**: Site footer
- **Card**: Product/item display card
- **Cart**: Shopping cart management
- **OffersSection**: Display active offers
- **OrderHistory**: List of past orders

### Admin Sub-components
- **Analysis**: Dashboard analytics and charts (Recharts)
- **Users**: User management interface
- **Branches**: Branch CRUD operations
- **Offers**: Offer management with file uploads

### Branch Manager Sub-components
- **InventoryManagement**: Stock tracking and management
- **StaffManagement**: Add/edit/view staff
- **OrdersAnalysis**: Sales and order analytics

---

## 🚨 Common Issues & Solutions

### MongoDB Connection Error
**Problem**: "Cannot connect to MongoDB"
```
Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGO_URI in .env is correct
3. For MongoDB Atlas: use connection string from dashboard
4. Check firewall/network access
```

### CORS Error
**Problem**: "Access to XMLHttpRequest blocked by CORS"
```
Solution:
1. Verify cors middleware is enabled in server.js
2. Check frontend URL is allowed in CORS policy
3. For production: update CORS_ORIGIN environment variable
```

### JWT Token Invalid
**Problem**: "Authentication failed" or "Unauthorized"
```
Solution:
1. Check token is being sent in Authorization header
2. Verify JWT_SECRET matches in .env
3. Clear localStorage and re-login
4. Check token expiry settings
```

### File Upload Not Working
**Problem**: Offer images not uploading
```
Solution:
1. Verify uploads/ directory exists
2. Check file permissions
3. Validate multer configuration
4. Ensure file size is within limits
5. For production: use cloud storage service
```

### Port Already in Use
**Problem**: "Error: listen EADDRINUSE :::5000"
```
Solution:
1. Change PORT in .env to unused port (e.g., 5001)
2. Kill process using port 5000: 
   Windows: taskkill /PID <PID> /F
   Linux/Mac: lsof -ti:5000 | xargs kill -9
```

---

## 🔐 Security Considerations

### Current Implementation
✅ Password hashing with bcrypt  
✅ JWT token-based authentication  
✅ CORS protection  
✅ Unique email constraint in database  
✅ Role-based access control  

### Recommended Enhancements
- [ ] Add request rate limiting (express-rate-limit)
- [ ] Implement HTTPS/SSL certificates
- [ ] Add request validation middleware
- [ ] Use helmet for security headers
- [ ] Implement refresh token rotation
- [ ] Add input sanitization
- [ ] Enable helmet for XSS protection
- [ ] Use environment-specific secrets management

---

## 🚀 Performance Optimization Tips

### Frontend Optimization
- Lazy load route components with React.lazy()
- Implement code splitting with Vite
- Use React.memo for expensive components
- Optimize images (WebP format, compression)
- Cache API responses with custom hooks
- Implement pagination for large lists

### Backend Optimization
- Add database indexes on frequently queried fields
- Implement caching layer (Redis)
- Use pagination for list endpoints
- Implement request compression
- Add query optimization with Mongoose select
- Use connection pooling

### Database Optimization
- Index email field (login queries)
- Index branch field (filtering)
- Use aggregation pipeline for analytics
- Archive old offers/orders

---

## 📦 Dependencies Overview

### Critical Dependencies
| Package | Purpose | Version |
|---------|---------|---------|
| mongoose | MongoDB ODM | 8.13.2 |
| express | Web framework | 5.1.0 |
| jsonwebtoken | JWT handling | 9.0.2 |
| bcrypt | Password hashing | 5.1.1 |
| react-router-dom | Frontend routing | 7.5.1 |
| axios | HTTP client | 1.8.4 |
| tailwindcss | CSS framework | 3.4.17 |

### Optional Enhancements
- **nodemon**: Auto-restart server on changes
- **dotenv-webpack**: Load .env in Vite builds
- **stripe**: Payment integration
- **socket.io**: Real-time notifications
- **redis**: Caching layer
- **jest**: Testing framework

---

## 📊 Database Indexing Recommendations

For better query performance, add indexes to frequently queried fields:

```javascript
// User.js - Add email index for login queries
userSchema.index({ email: 1 });

// Staff.js - Add branch index for filtering
staffSchema.index({ branch: 1 });

// Offer.js - Add date range index for active offers
offerSchema.index({ fromDate: 1, toDate: 1 });
```

---

## 🎯 Future Enhancement Ideas

### Phase 2 Features
- [ ] Real payment integration (Stripe/PayPal)
- [ ] Email notifications (nodemailer)
- [ ] SMS alerts for orders
- [ ] Customer reviews and ratings
- [ ] Loyalty program/points system
- [ ] Inventory low-stock alerts
- [ ] Dynamic pricing based on demand
- [ ] Multi-language support

### Technical Improvements
- [ ] Unit and integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] GraphQL alternative to REST
- [ ] Microservices architecture
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

## 📝 Key Learning Outcomes

This project demonstrates proficiency in:

✅ Full-stack development (MERN-like architecture)  
✅ Authentication & Authorization (JWT, Bcrypt)  
✅ RESTful API design  
✅ Database modeling with relationships  
✅ Role-based access control  
✅ React component design & hooks  
✅ Client-side routing  
✅ Form handling & validation  
✅ File uploads  
✅ Real-time data visualization  
✅ Error handling & user feedback  
✅ Modern build tools (Vite)  
✅ CSS frameworks (Tailwind)  

---

## 🚦 Running the Project

```bash
# Terminal 1 - Backend
cd cake-shop-backend
npm install
node server.js

# Terminal 2 - Frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## 📞 Test Credentials

```
Admin Account:
Email: admin@cake.com
Password: admin123

Branch Manager Account:
Email: manager@cake.com
Password: manager123

Customer Account:
Email: customer@cake.com
Password: customer123
```

---

## 📜 License

This project is created for educational and portfolio purposes.
