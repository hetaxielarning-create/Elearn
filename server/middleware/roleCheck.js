// Allow instructors and admins to manage course content
const instructorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ message: 'Instructor or admin access only' });
};

module.exports = { instructorOrAdmin };
