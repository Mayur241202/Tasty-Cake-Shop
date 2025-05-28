require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files statically

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/branches", require("./routes/branches"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/admin/users", require("./routes/adminUsers"));
app.use("/api/offers", require("./routes/Offers")); // ✅ Add this line

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
