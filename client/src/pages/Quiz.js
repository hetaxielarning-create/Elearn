import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getQuizById, submitQuiz } from "../services/api";
import { getErrorMessage, capitalize } from "../utils/helpers";
import "../styles/Quiz.css";

// A quiz is passed with a score of 40% or higher
const PASS_THRESHOLD = 40;

export default function Quiz() {
  const { id: courseId, quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await getQuizById(quizId);
        setQuiz(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  function handleAnswer(questionIndex, optionIndex) {
    const next = [...answers];
    next[questionIndex] = optionIndex;
    setAnswers(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!quiz?.questions?.length) return;
    if (answers.filter((a) => a !== undefined).length < quiz.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitQuiz(quiz._id, answers);
      setResult(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="container">Loading quiz...</p>;
  if (error && !quiz) return <p className="container form-error">{error}</p>;
  if (!quiz) return <p className="container">Quiz not found.</p>;

  if (result) {
    const { result: quizResult, recommendation } = result;
    const passed = quizResult.percentage >= PASS_THRESHOLD;

    return (
      <div className="container">
        <h1>Quiz Submitted</h1>
        <p>
          Score: {quizResult.score}/{quizResult.totalQuestions} (
          {quizResult.percentage}%)
        </p>

        {passed ? (
          <div className="card" style={{ borderLeft: "6px solid #27ae60" }}>
            <h3 style={{ color: "#27ae60" }}>✅ Quiz Passed</h3>
            <p>
              Recommended Next Level:{" "}
              <strong>{capitalize(recommendation.level)}</strong>
            </p>
            <p>{recommendation.message}</p>
          </div>
        ) : (
          <div className="card" style={{ borderLeft: "6px solid #c0392b" }}>
            <h3 style={{ color: "#c0392b" }}>You have not achieved the required score</h3>
            <p>
              Please review the recommended learning material and attempt
              the quiz again before progressing to the next level.
            </p>
            <p>{recommendation.message}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>

          {/* <Link 
          to={`/courses/${courseId}`}
          className="btn btn-primary"
          >
            {passed ? "View Recommended Materials" : "Review Learning Material"}
          </Link> */}
<Link
  to="/recommendations"
  state={{ courseId }}
  className="btn btn-primary"
>
              {passed ? "View Recommended Materials" : "Review Learning Material"}
 </Link>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{quiz.title}</h1>
      {quiz.level && <span className="badge">{capitalize(quiz.level)}</span>}

      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleSubmit} className="quiz-form">
        {quiz.questions?.map((q, index) => (
          <div key={q._id || index} className="quiz-question">
            <p className="question-text">
              {index + 1}. {q.questionText}
            </p>
            <div className="quiz-options">
              {q.options?.map((option, optIndex) => (
                <label key={optIndex} className="quiz-option">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    checked={answers[index] === optIndex}
                    onChange={() => handleAnswer(index, optIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </form>
    </div>
  );
}
