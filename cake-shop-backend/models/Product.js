const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [3, "Product name must be at least 3 characters long"],
    maxlength: [100, "Product name cannot exceed 100 characters"],
    validate: {
      validator: function(value) {
        // Check if the value contains at least one non-numeric character
        return !/^\d+$/.test(value) && /[a-zA-Z]/.test(value);
      },
      message: "Product name must contain letters and cannot be only numbers"
    }
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    default: 0,
    min: [0, "Quantity cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer"
    }
  },
  unit: {
    type: String,
    required: [true, "Unit is required"],
    trim: true,
    minlength: [1, "Unit must be at least 1 character"],
    maxlength: [20, "Unit cannot exceed 20 characters"],
    validate: {
      validator: function(value) {
        // Check if the value is not purely numeric
        return !/^\d+$/.test(value) && /[a-zA-Z]/.test(value);
      },
      message: "Unit must contain letters and cannot be only numbers"
    },
    enum: {
      values: ["pcs", "kg", "g", "box", "pack", "dozen", "ml", "l"],
      message: "Unit must be one of: pcs, kg, g, box, pack, dozen, ml, l"
    }
  },
  type: {
    type: String,
    required: [true, "Product type is required"],
    enum: {
      values: ["Cakes", "Pastries", "Snacks"],
      message: "Type must be one of: Cakes, Pastries, Snacks"
    }
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: "Price must be a valid positive number"
    }
  },
  branch: {
    type: String,
    required: [true, "Branch is required"],
    trim: true,
    minlength: [2, "Branch name must be at least 2 characters"],
    maxlength: [50, "Branch name cannot exceed 50 characters"],
  },
  image: {
    type: String,
    default: null, // Path to uploaded image file
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Custom validation before saving
productSchema.pre("save", function(next) {
  // Ensure price and quantity are valid numbers
  if (typeof this.price !== "number" || isNaN(this.price)) {
    next(new Error("Price must be a valid number"));
  }
  if (typeof this.quantity !== "number" || isNaN(this.quantity)) {
    next(new Error("Quantity must be a valid number"));
  }
  // Trim all string fields
  if (this.name) this.name = this.name.trim();
  if (this.unit) this.unit = this.unit.trim();
  if (this.branch) this.branch = this.branch.trim();
  next();
});

module.exports = mongoose.model("Product", productSchema);
