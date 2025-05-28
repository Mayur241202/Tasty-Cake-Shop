const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  name: String,
  location: String,
});

module.exports = mongoose.model("Branch", BranchSchema);