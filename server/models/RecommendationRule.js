const mongoose = require('mongoose');
// Each rule recommends a level based on the student's score
const recommendationRuleSchema = new mongoose.Schema(
  {
    minScore: { type: Number, required: true }, // inclusive lower bound (%)
    maxScore: { type: Number, required: true }, // inclusive upper bound (%)
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    message: { type: String, required: true }, // shown to student explaining the recommendation
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecommendationRule', recommendationRuleSchema);
