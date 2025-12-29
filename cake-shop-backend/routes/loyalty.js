const express = require("express");
const router = express.Router();
const User = require("../models/User");
const LoyaltyTransaction = require("../models/LoyaltyTransaction");
const jwt = require("jsonwebtoken");

// Middleware to authenticate the user using JWT token
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, "mySuperSecretKey123!", (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }
    req.userEmail = decoded.email;
    req.userId = decoded.id;
    next();
  });
};

// GET - Get customer loyalty points balance
router.get("/balance", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: user.email,
      loyaltyPoints: user.loyaltyPoints || 0,
      firstName: user.firstname,
      lastName: user.lastname
    });
  } catch (error) {
    console.error("Error fetching loyalty balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get loyalty transaction history
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const transactions = await LoyaltyTransaction.find({ customerEmail: req.userEmail })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      totalTransactions: transactions.length,
      transactions: transactions.map(t => ({
        _id: t._id,
        points: t.points,
        type: t.type,
        reason: t.reason,
        balanceAfter: t.balanceAfter,
        date: t.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get loyalty information and benefits
router.get("/info", (req, res) => {
  res.json({
    program: {
      name: "Tasty Cake Shop Loyalty Program",
      description: "Earn points on every purchase and redeem them for discounts"
    },
    benefits: {
      pointsPerRupee: 1,
      redeemValue: 1000, // 1000 points = ₹1 discount
      minimumPointsToRedeem: 1000,
      benefits: [
        "Earn 1 loyalty point for every ₹1 spent",
        "Redeem 1000+ points for ₹1 discount on orders",
        "Track your rewards and transaction history",
        "Exclusive benefits for loyal customers"
      ]
    }
  });
});

module.exports = router;
