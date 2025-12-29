const mongoose = require("mongoose");

const LoyaltyTransactionSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: true,
    index: true
  },
  points: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["earn", "redeem"],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null
  },
  balanceBefore: Number,
  balanceAfter: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("LoyaltyTransaction", LoyaltyTransactionSchema);
