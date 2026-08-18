// Allows either instructors or admins through — used on routes that
// instructors need to manage their own content (courses, materials,
// quizzes), where a plain adminOnly check would lock them out.
const instructorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ message: 'Instructor or admin access only' });
};

module.exports = { instructorOrAdmin };
