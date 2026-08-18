const mongoose = require('mongoose');

// A controlled vocabulary of course categories, managed by admin.
// Course.category stays a free-text string (unchanged, so nothing breaks) —
// this just gives admin a dropdown of standard options to keep it tidy.
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
