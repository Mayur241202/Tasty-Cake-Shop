const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "branchmanager", "customer"],
    default: "customer"
  },
  branch: {
    type: String,
    required: function () {
      return this.role === "branchmanager";
    },
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);