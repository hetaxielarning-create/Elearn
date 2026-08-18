const Progress = require("../models/Progress");
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");

const getMyProgress = async (req, res) => {
  try {
    const progressRecords = await Progress.find({
      student: req.user._id,
    }).populate("course", "title category");

    const result = [];

    for (const p of progressRecords) {
      const courseId = p.course._id;

      const totalQuizzes = await Quiz.countDocuments({
        course: courseId,
      });

      const attemptedQuizIds = await QuizResult.distinct("quiz", {
        student: req.user._id,
        course: courseId,
      });

      const completedQuizzes = attemptedQuizIds.length;

      let courseProgress = 0;

      if (totalQuizzes > 0) {
        courseProgress = Math.round(
          (completedQuizzes / totalQuizzes) * 100
        );
      }

      result.push({
        ...p.toObject(),
        totalQuizzes,
        completedQuizzes,
        courseProgress,
      });
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getMyProgress };