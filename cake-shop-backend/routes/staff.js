const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const User = require("../models/User");
const Branch = require("../models/Branch");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // Add this

// Middleware to authenticate tokens
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "mySuperSecretKey123!");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

router.get("/", auth, async (req, res) => {
    try {
      // Always populate the branch field when returning staff data
      const staff = await Staff.find()
        .populate('branch', 'name location')
        .sort({ createdAt: -1 });
      
      res.json(staff);
    } catch (err) {
      console.error("Error fetching staff:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

// POST new staff member - simplified version for debugging
router.post("/", auth, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);

    // Get manager data
    const manager = await User.findById(req.user.id);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    console.log("Manager found:", manager);

    // For debugging - let's find the branch
    let branchId;
    
    if (manager.role === "branchmanager") {
      console.log("Manager's branch:", manager.branch);
      
      // Check if branch is stored as string or ObjectId
      if (typeof manager.branch === 'string') {
        // First try to convert to ObjectId if it's in that format
        if (mongoose.Types.ObjectId.isValid(manager.branch)) {
          branchId = manager.branch;
        } else {
          // Try to find branch by name
          const branch = await Branch.findOne({ name: manager.branch });
          if (branch) {
            branchId = branch._id;
          } else {
            // Create a new branch if not found
            const newBranch = new Branch({ name: manager.branch, location: "Default" });
            const savedBranch = await newBranch.save();
            branchId = savedBranch._id;
          }
        }
      } else {
        // It's already an ObjectId
        branchId = manager.branch;
      }
    } else if (manager.role === "admin" && req.body.branch) {
      branchId = req.body.branch;
    } else {
      return res.status(400).json({ message: "Branch information is required" });
    }

    console.log("Branch ID to use:", branchId);

    // Create new staff member
    const { name, role, contact } = req.body;
    
    const newStaff = new Staff({
      name,
      role,
      contact,
      branch: branchId,
      createdBy: req.user.id
    });

    // After saving the staff, populate the branch field before sending the response
    const savedStaff = await newStaff.save();
    const populatedStaff = await Staff.findById(savedStaff._id).populate('branch', 'name location');
    
    res.status(201).json(populatedStaff);
  } catch (err) {
    console.error("Error adding staff:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
    try {
      const { name, role, contact } = req.body;
  
      const staff = await Staff.findById(req.params.id);
      if (!staff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      // Update only the fields that were provided
      if (name) staff.name = name;
      if (role) staff.role = role;
      if (contact) staff.contact = contact;
  
      const updatedStaff = await staff.save();
      const populatedStaff = await Staff.findById(updatedStaff._id).populate("branch", "name location");
  
      res.json(populatedStaff);
    } catch (err) {
      console.error("Error updating staff:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  

// DELETE staff member
router.delete("/:id", auth, async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff member deleted" });
  } catch (err) {
    console.error("Error deleting staff:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;