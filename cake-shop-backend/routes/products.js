const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const router = express.Router();

// Set up multer for image uploads
const uploadsDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Get all products from all branches
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Get all products for a specific branch
router.get("/:branch", async (req, res) => {
  try {
    const { branch } = req.params;
    const products = await Product.find({ branch }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Create a new product with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, quantity, unit, type, price, branch } = req.body || {};

    if (!name || !unit || !type || !price || !branch) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Missing required fields: name, unit, type, price, branch" });
    }

    // Validate branch exists (basic check)
    const validBranches = ["Central", "West", "East"];
    if (!validBranches.includes(branch)) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Invalid branch name" });
    }

    const newProduct = new Product({
      name,
      quantity: quantity || 0,
      unit,
      type,
      price: Number(price),
      branch,
      image: req.file ? `/uploads/products/${req.file.filename}` : null,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map(error => error.message)
        .join(", ");
      return res.status(400).json({ message: `Validation Error: ${messages}` });
    }
    res.status(500).json({ message: err.message || "Failed to create product" });
  }
});

// Update a product with optional image upload
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit, type, price, branch } = req.body || {};

    if (!name || quantity === undefined || !unit || !type || price === undefined) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.findById(id);
    if (!product) {
      // Clean up uploaded file if product not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Product not found" });
    }

    // If branch is provided in update, validate it matches the product's current branch
    // This prevents branch managers from moving products to other branches
    if (branch && branch !== product.branch) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: "Cannot change product branch" });
    }

    // If new image is uploaded, delete old image
    if (req.file && product.image) {
      const oldImagePath = path.join(__dirname, "../" + product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        quantity: Number(quantity),
        unit,
        type,
        price: Number(price),
        image: req.file ? `/uploads/products/${req.file.filename}` : product.image,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map(error => error.message)
        .join(", ");
      return res.status(400).json({ message: `Validation Error: ${messages}` });
    }
    res.status(500).json({ message: err.message || "Failed to update product" });
  }
});

// Delete a product (and its image)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image file if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, "../" + product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
