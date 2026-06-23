const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    resourceName: {
      type: String,
      required: false,   // ← FIXED: was required: true, empty string was failing
      trim: true,
      default: "",
    },
    // Columns 1–12 stored as a plain object: { "1": "val", "2": "val", ... }
    columns: {
      type: Object,      // ← FIXED: was Map, caused .set() errors & serialization issues
      default: {},
    },
    projectName: {
      type: String,
      default: '',
    },
    version: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);