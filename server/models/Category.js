const mongoose = require('mongoose');
// Admin manages a list of standard course categories
// Course category remains a text field to avoid breaking existing data
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
