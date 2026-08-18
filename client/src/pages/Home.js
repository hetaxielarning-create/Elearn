import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container home-hero">
      <h1>Intelligent E-Learning Platform</h1>
      <p>
        Learn at your own pace. Attempt quizzes and get transparent,
        rule-based recommendations for what to study next — no black-box
        machine learning, just clear IF&ndash;THEN logic you can trust.
      </p>
      <div className="home-actions">
        <Link to="/courses" className="btn btn-primary">
          Browse Courses
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Get Started
        </Link>
      </div>

      <div className="home-steps">
        <div className="step">
          <h3>1. Study</h3>
          <p>Work through learning materials for each course.</p>
        </div>
        <div className="step">
          <h3>2. Attempt Quiz</h3>
          <p>Test your understanding with a short quiz.</p>
        </div>
        <div className="step">
          <h3>3. Get Recommendations</h3>
          <p>Receive materials matched to your quiz score.</p>
        </div>
      </div>

      <h2 className="section-heading">Three Portals, One Platform</h2>
      <p className="muted">
        Everyone signs in from the same Login page — the platform recognises
        your role and takes you to the right dashboard automatically.
      </p>

      <div className="home-steps">
        <div className="step">
          <h3>🎓 Student</h3>
          <p>
            Register freely. Browse and enroll in courses, work through
            materials, attempt quizzes, and get personalised recommendations,
            progress tracking, and certificates.
          </p>
          <Link to="/register" className="link-more">
            Register as a Student &rarr;
          </Link>
        </div>
        <div className="step">
          <h3>👩‍🏫 Instructor</h3>
          <p>
            Instructor accounts are created by the platform administrator —
            there's no public instructor sign-up. Once provisioned,
            instructors manage their own courses, chapters, materials, and
            quizzes, and track their students' results.
          </p>
          <Link to="/login?portal=instructor" className="link-more">
            Instructor Login &rarr;
          </Link>
        </div>
        <div className="step">
          <h3>🛠️ Admin</h3>
          <p>
            A single fixed administrator account oversees the whole
            platform — managing students, instructors, categories, courses,
            quizzes, certificates, announcements, and analytics.
          </p>
          <Link to="/login?portal=admin" className="link-more">
            Admin Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
