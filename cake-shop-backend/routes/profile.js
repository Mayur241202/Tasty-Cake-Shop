// routes/profile.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware to authenticate the user using JWT token
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, "mySuperSecretKey123!", (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }
    req.userId = decoded.id; // Store user ID in the request object
    next();
  });
};

// Get current user profile
router.get("/me", authenticateUser, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-password"); // remove password from response
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Update Profile
router.put("/update", authenticateUser, async (req, res) => {
    const { firstname, lastname, email, mobile, password } = req.body;
    const userId = req.userId; // Use the correct user ID from the JWT token
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email is already in use" });
        }
      }
  
      // Update fields
      if (firstname) user.firstname = firstname;
      if (lastname) user.lastname = lastname;
      if (email) user.email = email;
      if (mobile) user.mobile = mobile;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
      res.json(user); // Return updated user data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
