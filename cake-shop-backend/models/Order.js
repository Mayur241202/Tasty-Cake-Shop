const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  items: [
    {
      title: String,
      price: Number,
      qty: Number
    }
  ],
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Processing", "Delivered", "Cancelled"],
    default: "Processing"
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", OrderSchema);
