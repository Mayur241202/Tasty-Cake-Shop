const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST - Create feedback
router.post("/create", async (req, res) => {
  try {
    const { customerEmail, customerName, text, rating } = req.body;

    if (!customerEmail || !customerName || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newFeedback = new Feedback({
      customerEmail,
      customerName,
      text,
      rating: rating || 5
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get feedback by customer email
router.get("/customer/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const feedback = await Feedback.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get all feedback (for admin/branch managers)
router.get("/all", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get feedback by branch
router.get("/branch/:branchName", async (req, res) => {
  try {
    const { branchName } = req.params;
    const feedback = await Feedback.find({ 
      $or: [
        { branch: branchName },
        { branch: "All Branches" }
      ]
    }).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Delete feedback by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
