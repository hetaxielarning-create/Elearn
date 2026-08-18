import React from "react";
import { Link } from "react-router-dom";

export default function QuizCard({ quiz, courseId }) {
  return (
    <div className="card quiz-card">
      <h4>{quiz.title}</h4>
      <p>{quiz.questions?.length || 0} questions</p>
      <Link to={`/courses/${courseId}/quiz`} className="btn btn-primary">
        Attempt Quiz
      </Link>
    </div>
  );
}
