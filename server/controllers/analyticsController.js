const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// @route GET /api/analytics/overview  (admin only)
const getOverview = async (req, res) => {
  const [studentCount, instructorCount, courseCount, quizCount, resultCount] =
    await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      Course.countDocuments(),
      Quiz.countDocuments(),
      QuizResult.countDocuments(),
    ]);

  // Average score across all attempts
  const avgAgg = await QuizResult.aggregate([
    { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } },
  ]);
  const averageScore = avgAgg.length > 0 ? Math.round(avgAgg[0].avgPercentage) : 0;

  // How many results landed at each recommended level (mirrors the IF-THEN rule outcomes)
  const levelAgg = await QuizResult.aggregate([
    { $group: { _id: '$recommendedLevel', count: { $sum: 1 } } },
  ]);
  const levelBreakdown = { beginner: 0, intermediate: 0, advanced: 0 };
  levelAgg.forEach((row) => {
    if (row._id && levelBreakdown[row._id] !== undefined) {
      levelBreakdown[row._id] = row.count;
    }
  });

  // Most-attempted courses
  const topCoursesAgg = await QuizResult.aggregate([
    { $group: { _id: '$course', attempts: { $sum: 1 } } },
    { $sort: { attempts: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    { $project: { _id: 0, title: '$course.title', attempts: 1 } },
  ]);

  res.json({
    counts: {
      students: studentCount,
      instructors: instructorCount,
      courses: courseCount,
      quizzes: quizCount,
      quizAttempts: resultCount,
    },
    averageScore,
    levelBreakdown,
    topCourses: topCoursesAgg,
  });
};

module.exports = { getOverview };
