require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // serve uploaded files statically

// Make io accessible to routes
app.set("io", io);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/branches", require("./routes/branches"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/admin/users", require("./routes/adminUsers"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/products", require("./routes/products"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/loyalty", require("./routes/loyalty"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  // When a branch manager joins, add them to their branch room
  socket.on("join_branch", (branchName) => {
    socket.join(branchName);
    console.log(`${socket.id} joined branch: ${branchName}`);
  });
  
  // When client disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
