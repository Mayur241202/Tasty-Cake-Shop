# LocalStorage vs Database Analysis

## Summary
The application is using localStorage for several types of data that should be stored in MongoDB for proper functionality. Below is a detailed breakdown:

---

## 1. **ORDERS** ❌ Currently: localStorage | ✅ Should be: MongoDB
**File**: `src/pages/customer.jsx`
**Lines**: 129-133, 468-469
**Data**: `all_customer_orders` - Customer order history

### Current Implementation:
```javascript
// Line 130
const allOrders = JSON.parse(localStorage.getItem("all_customer_orders") || "[]");
// Line 468-469
localStorage.setItem("all_customer_orders", JSON.stringify([newOrder, ...allOrders]));
```

### Issues:
- Orders are lost when browser cache is cleared
- No persistence across devices
- Branch managers see fallback localStorage data if API fails

### Status: 
✅ **PARTIALLY FIXED** - Orders API created (`/api/orders`), but localStorage fallback still used
- MongoDB: Orders are saved here
- LocalStorage: Backup still used as fallback

---

## 2. **CUSTOMER FEEDBACK** ❌ Currently: React State Only | ✅ Should be: MongoDB
**File**: `src/pages/customer.jsx`
**Lines**: 136-137, 486-491
**Data**: Customer feedback/reviews

### Current Implementation:
```javascript
// Line 136-137
const [feedback, setFeedback] = useState("");
const [feedbacks, setFeedbacks] = useState([]);

// Line 486-491
const handleFeedbackSubmit = (e) => {
  e.preventDefault();
  if (feedback.trim() === "") return;
  setFeedbacks([{ text: feedback, date: new Date().toLocaleString() }, ...feedbacks]);
  setFeedback("");
};
```

### Issues:
- **CRITICAL**: Feedback is not stored anywhere - only in component state
- Feedback is lost on page refresh
- No way for admin to view all customer feedback
- No persistence

### Solution Needed:
- Create Feedback model in MongoDB
- Create `/api/feedback` endpoints
- Save feedback to database when submitted
- Display feedback from database

---

## 3. **LOYALTY POINTS** ⚠️ Currently: User Model | ✅ Correct: MongoDB
**File**: `src/pages/customer.jsx`
**Lines**: 110, 117, 188, 195, 481

### Current Implementation:
```javascript
// Stored in User model
profile.loyaltyPoints
editProfile.loyaltyPoints
```

### Status:
✅ **CORRECT** - Loyalty points are stored in MongoDB User model and fetched via `/api/profile/me`
- Added when orders are placed (Line 481)
- Persisted in User model

---

## 4. **AUTHENTICATION TOKENS** ✅ Currently: localStorage | ✅ CORRECT (Best Practice)
**File**: Multiple files
**Lines**: 149, 172, 326, 444

### Current Implementation:
```javascript
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
```

### Status:
✅ **CORRECT** - JWT tokens in localStorage is the standard practice for SPAs
- Token used for API authentication
- User data cached for quick access

---

## 5. **ORDER HISTORY - BRANCH MANAGER VIEW** ⚠️ Currently: localStorage fallback
**File**: `src/components/branchManager/ordersAnalysis.jsx`
**Lines**: 62-63, 68-69

### Current Implementation:
```javascript
// Fallback to localStorage if API fails
const savedOrders = JSON.parse(localStorage.getItem("all_customer_orders") || "[]");
```

### Status:
⚠️ **PARTIALLY FIXED** - Primary source is MongoDB API, but fallback to localStorage
- API call: `/api/orders/branch/:branchName` ✅
- Fallback: localStorage (should be removed)

---

## PRIORITY FIX LIST

### Priority 1: CRITICAL ⛔
- [ ] **Feedback/Reviews** - Currently only in React state, needs MongoDB
  - Create: `models/Feedback.js`
  - Create: `routes/feedback.js`
  - Update: `src/pages/customer.jsx` - handleFeedbackSubmit

### Priority 2: HIGH 🔴
- [x] **Orders** - Partially fixed (API created, still uses localStorage fallback)
  - Action: Remove localStorage fallback when MongoDB API is reliable

### Priority 3: MEDIUM 🟡
- [ ] **Branch Manager Fallback** - Remove localStorage fallback
  - Update: `src/components/branchManager/ordersAnalysis.jsx`
  - Remove: localStorage.getItem() fallback

---

## Data Models Needed

### 1. Feedback Model (NEW)
```javascript
// models/Feedback.js
const FeedbackSchema = {
  customerEmail: String,
  customerName: String,
  text: String,
  rating: Number,
  date: Date,
  createdAt: Date
};
```

### 2. Loyalty Points (ALREADY IN USER MODEL)
```javascript
// Already in User model
loyaltyPoints: Number
```

---

## API Endpoints Created ✅
- [x] `POST /api/orders/create` - Create order
- [x] `GET /api/orders/branch/:branchName` - Get branch orders
- [x] `GET /api/orders/all` - Get all orders
- [x] `PUT /api/orders/:orderId/status` - Update order status
- [ ] `POST /api/feedback` - Create feedback (NOT YET)
- [ ] `GET /api/feedback/:email` - Get customer feedback (NOT YET)
- [ ] `GET /api/feedback/all` - Get all feedback (NOT YET)

---

## API Endpoints Still Needed ⛔

### Feedback APIs
```
POST /api/feedback - Create feedback
GET /api/feedback/customer - Get feedback by customer email
GET /api/feedback/all - Get all feedback (admin only)
DELETE /api/feedback/:id - Delete feedback
```

---

## Files That Need Updates

### Must Update:
1. `src/pages/customer.jsx` - Remove orders localStorage fallback, add feedback API
2. `src/components/branchManager/ordersAnalysis.jsx` - Remove localStorage fallback
3. Backend: Create feedback routes and model

### Optional Cleanup:
1. Remove `dummyOrdersInit` from customer.jsx
2. Remove `dummyProfile` usage (already mostly done)

---

## Testing Checklist

- [ ] Place order from customer → saved to MongoDB
- [ ] Check branch manager sees order
- [ ] Clear browser cache → order still visible (not in localStorage)
- [ ] Submit feedback → saved to database
- [ ] View feedback from database
- [ ] Update loyalty points → persists in database
- [ ] Logout and login → all data still available

---

## Summary Table

| Data | Current | Target | Status | Priority |
|------|---------|--------|--------|----------|
| Orders | localStorage + DB | DB only | ⚠️ Partial | High |
| Feedback | React State | DB | ❌ None | Critical |
| Loyalty Points | User Model DB | User Model DB | ✅ Done | - |
| Auth Token | localStorage | localStorage | ✅ Correct | - |
| Cart | React State | React State | ✅ Correct | - |
| User Profile | DB | DB | ✅ Done | - |

