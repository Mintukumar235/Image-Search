const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: String,
  description: String,
  keywords: [String],
  filename: String,
  createdAt: { type: Date, default: Date.now },
});

// Define text index
imageSchema.index({ title: "text", keywords: "text" });

module.exports = mongoose.model("Image", imageSchema);
