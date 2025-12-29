const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const LoyaltyTransaction = require("../models/LoyaltyTransaction");
const jwt = require("jsonwebtoken");

// Loyalty Points Configuration
const POINTS_PER_RUPEE = 1; // 1 point per rupee spent
const POINTS_FOR_ONE_RUPEE = 1000; // 1000 points = ₹1 discount

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
    req.userId = decoded.id;
    next();
  });
};

// Helper function to award loyalty points
const awardLoyaltyPoints = async (customerEmail, points, orderId, reason) => {
  try {
    const user = await User.findOne({ email: customerEmail });
    if (!user) return;

    const balanceBefore = user.loyaltyPoints || 0;
    const balanceAfter = balanceBefore + points;

    // Update user loyalty points
    user.loyaltyPoints = balanceAfter;
    await user.save();

    // Record transaction
    await LoyaltyTransaction.create({
      customerEmail,
      points,
      type: "earn",
      reason,
      orderId,
      balanceBefore,
      balanceAfter
    });
  } catch (error) {
    console.error("Error awarding loyalty points:", error);
  }
};

// POST - Create a new order
router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { customerName, customerEmail, items, address, city, pincode, total, branch, pointsRedeemed = 0 } = req.body;

    const newOrder = new Order({
      customerName,
      customerEmail,
      items,
      address,
      city,
      pincode,
      total,
      branch,
      status: "Processing"
    });

    await newOrder.save();

    // Award loyalty points: 1 point per rupee spent
    const pointsToAward = Math.floor(total * POINTS_PER_RUPEE);
    if (pointsToAward > 0) {
      await awardLoyaltyPoints(
        customerEmail,
        pointsToAward,
        newOrder._id,
        `Order #${newOrder._id.toString().slice(-6)} completed`
      );
    }

    // Deduct redeemed points if any
    if (pointsRedeemed > 0) {
      const user = await User.findOne({ email: customerEmail });
      if (user) {
        const balanceBefore = user.loyaltyPoints || 0;
        user.loyaltyPoints = Math.max(0, balanceBefore - pointsRedeemed);
        await user.save();

        await LoyaltyTransaction.create({
          customerEmail,
          points: pointsRedeemed,
          type: "redeem",
          reason: `Redeemed for order #${newOrder._id.toString().slice(-6)}`,
          orderId: newOrder._id,
          balanceBefore,
          balanceAfter: user.loyaltyPoints
        });
      }
    }
    
    // Emit socket.io event to branch managers of this branch
    const io = req.app.get("io");
    io.to(branch).emit("new_order", {
      orderId: newOrder._id,
      customerName: newOrder.customerName,
      total: newOrder.total,
      branch: newOrder.branch,
      timestamp: new Date()
    });
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get all orders for a customer
router.get("/customer", authenticateUser, async (req, res) => {
  try {
    const user = req.userId;
    const orders = await Order.find({ customerEmail: user.email });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get all orders (admin/branch manager)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get orders by branch
router.get("/branch/:branchName", async (req, res) => {
  try {
    const { branchName } = req.params;
    const orders = await Order.find({ branch: branchName }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Update order status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Delete an order
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndDelete(orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
