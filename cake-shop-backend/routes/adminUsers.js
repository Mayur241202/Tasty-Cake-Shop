// routes/adminUsers.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Staff = require('../models/Staff');

// GET combined list of registered customers/managers/admins and staff
router.get('/', async (req, res) => {
    try {
      // Fetch all users
      const users = await User.find()
        .select('firstname lastname role branch')
        .lean();
  
      // Fetch all staff
      const staff = await Staff.find()
        .populate('branch', 'name')
        .select('name role branch')
        .lean();
  
      // Normalize users into unified format
      const formattedUsers = users.map(u => ({
        _id: u._id,
        name: `${u.firstname} ${u.lastname}`,
        role: u.role,
        branch: u.branch?.name || u.branch || 'N/A',
        type: 'user'
      }));
  
      // Normalize staff into same format
      const formattedStaff = staff.map(s => ({
        _id: s._id,
        name: s.name,
        role: s.role,
        branch: s.branch?.name || 'N/A',
        type: 'staff'
      }));
  
      // Combine and return
      res.json([...formattedUsers, ...formattedStaff]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });


// DELETE /api/admin/users/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      // Try deleting a User
      const user = await User.findByIdAndDelete(id);
      if (user) {
        return res.json({ message: "User deleted successfully" });
      }
  
      // If no User, try deleting a Staff
      const staff = await Staff.findByIdAndDelete(id);
      if (staff) {
        return res.json({ message: "Staff deleted successfully" });
      }
  
      // Neither found
      return res.status(404).json({ message: "Record not found" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
