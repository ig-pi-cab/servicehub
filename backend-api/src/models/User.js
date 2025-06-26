const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    googleId: { type: String, default: null },

    roles: {
      type: [String],
      default: ["client"],
      enum: ["client", "provider"],
    },
    activeRole: {
      type: String,
      enum: ["client", "provider"],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
