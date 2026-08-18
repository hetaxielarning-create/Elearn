const mongoose = require('mongoose');

// Each document = one IF-THEN rule: IF percentage falls in [minScore, maxScore] THEN recommend `level` materials
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
