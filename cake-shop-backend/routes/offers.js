const express = require("express");
const multer = require("multer");
const Offer = require("../models/Offer");
const router = express.Router();
const path = require("path");

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/offers/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Create Offer
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, branch, fromDate, toDate } = req.body;
    const fileName = req.file.filename;
    const filePath = `/uploads/offers/${fileName}`;

    const newOffer = new Offer({
      title,
      fileName,
      filePath,
      branch,
      fromDate,
      toDate,
    });
    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create offer" });
  }
});

// Get All Offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});

// Update Offer
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, branch, fromDate, toDate } = req.body;
    const offerId = req.params.id;

    if (!title || !branch || !fromDate || !toDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.title = title;
    offer.branch = branch;
    offer.fromDate = fromDate;
    offer.toDate = toDate;

    if (req.file) {
      offer.fileName = req.file.filename;
      offer.filePath = `/uploads/offers/${req.file.filename}`;
    }

    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update offer", error: err.message });
  }
});

// Delete Offer
router.delete("/:id", async (req, res) => {
  try {
    const offerId = req.params.id;
    const offer = await Offer.findByIdAndDelete(offerId);
    
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete offer" });
  }
});

module.exports = router;