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

module.exports = router;