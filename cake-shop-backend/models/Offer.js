const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  branch: { type: String, default: "all" },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);