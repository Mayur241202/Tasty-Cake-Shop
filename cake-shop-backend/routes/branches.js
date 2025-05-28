const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");

// GET all branches
router.get("/", async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

// POST new branch
router.post("/", async (req, res) => {
  const { name, location } = req.body;
  const newBranch = new Branch({ name, location });
  await newBranch.save();
  res.status(201).json(newBranch);
});

// DELETE branch
router.delete("/:id", async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.json({ message: "Branch deleted" });
});

module.exports = router;