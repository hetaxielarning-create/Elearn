const RecommendationRule = require('../models/RecommendationRule');
const LearningMaterial = require('../models/LearningMaterial');

// Default recommendation rules if no rules are set
// Below 40 = beginner, 40-70 = intermediate, above 70 = advanced
const DEFAULT_RULES = [
  { minScore: 0, maxScore: 39, level: 'beginner', message: 'Score below 40% - recommending beginner materials, revision notes, and a practice quiz.' },
  { minScore: 40, maxScore: 70, level: 'intermediate', message: 'Score between 40-70% - recommending intermediate materials and additional exercises.' },
  { minScore: 71, maxScore: 100, level: 'advanced', message: 'Score above 70% - recommending advanced materials and the next course.' },
];

/**
 * Recommend a learning level based on the student's score
 * and get matching course materials.
 */
async function getRecommendation(percentage, courseId) {
  let rules = await RecommendationRule.find().sort({ minScore: 1 });
  if (!rules || rules.length === 0) {
    rules = DEFAULT_RULES;
  }

// Find the rule that matches the student's score
  const matchedRule = rules.find((r) => percentage >= r.minScore && percentage <= r.maxScore);
  const level = matchedRule ? matchedRule.level : 'beginner';
  const message = matchedRule ? matchedRule.message : 'Recommending beginner materials.';

  const materials = await LearningMaterial.find({ course: courseId, level });

  return { level, message, materials };
}

module.exports = { getRecommendation, DEFAULT_RULES };
