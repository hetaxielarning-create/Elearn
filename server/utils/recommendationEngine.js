const RecommendationRule = require('../models/RecommendationRule');
const LearningMaterial = require('../models/LearningMaterial');

// Default fallback rules if the admin hasn't configured any in the DB yet.
// Matches the IF-THEN logic from the dissertation spec:
// <40 -> beginner, 40-70 -> intermediate, >70 -> advanced
const DEFAULT_RULES = [
  { minScore: 0, maxScore: 39, level: 'beginner', message: 'Score below 40% - recommending beginner materials, revision notes, and a practice quiz.' },
  { minScore: 40, maxScore: 70, level: 'intermediate', message: 'Score between 40-70% - recommending intermediate materials and additional exercises.' },
  { minScore: 71, maxScore: 100, level: 'advanced', message: 'Score above 70% - recommending advanced materials and the next course.' },
];

/**
 * Given a percentage score and a course, determine the recommended level
 * by evaluating IF-THEN rules (admin-managed, falling back to defaults),
 * then fetch matching learning materials for that course/level.
 */
async function getRecommendation(percentage, courseId) {
  let rules = await RecommendationRule.find().sort({ minScore: 1 });
  if (!rules || rules.length === 0) {
    rules = DEFAULT_RULES;
  }

  // Find the first rule whose range contains the score (the IF-THEN evaluation)
  const matchedRule = rules.find((r) => percentage >= r.minScore && percentage <= r.maxScore);
  const level = matchedRule ? matchedRule.level : 'beginner';
  const message = matchedRule ? matchedRule.message : 'Recommending beginner materials.';

  const materials = await LearningMaterial.find({ course: courseId, level });

  return { level, message, materials };
}

module.exports = { getRecommendation, DEFAULT_RULES };
