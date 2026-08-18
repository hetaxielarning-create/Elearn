import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Quiz from "./pages/Quiz";
import Recommendations from "./pages/Recommendations";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/AdminDashboard";
import ManageCourses from "./pages/ManageCourses";
import ManageMaterials from "./pages/ManageMaterials";
import ManageQuizzes from "./pages/ManageQuizzes";
import ManageRules from "./pages/ManageRules";
import ManageStudents from "./pages/ManageStudents";

import Profile from "./pages/Profile";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import InstructorChapters from "./pages/InstructorChapters";
import InstructorMaterials from "./pages/InstructorMaterials";
import InstructorQuizzes from "./pages/InstructorQuizzes";
import InstructorResults from "./pages/InstructorResults";

import Certificates from "./pages/Certificates";
import Notifications from "./pages/Notifications";
import ManageCategories from "./pages/ManageCategories";
import ManageInstructors from "./pages/ManageInstructors";
import ManageCertificates from "./pages/ManageCertificates";
import ManageAnnouncements from "./pages/ManageAnnouncements";
import Analytics from "./pages/Analytics";
import AdminChapters from "./pages/AdminChapters";

import "./styles/Global.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student routes */}
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/quiz/:quizId"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Instructor routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute instructorOnly>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute instructorOnly>
                  <InstructorCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/chapters"
              element={
                <ProtectedRoute instructorOnly>
                  <InstructorChapters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/materials"
              element={
                <ProtectedRoute instructorOnly>
                  <InstructorMaterials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/quizzes"
              element={
                <ProtectedRoute instructorOnly>
                  <InstructorQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/results"
              element={
                <ProtectedRoute instructorOnly>
                  <InstructorResults />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute adminOnly>
                  <ManageCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/materials"
              element={
                <ProtectedRoute adminOnly>
                  <ManageMaterials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <ProtectedRoute adminOnly>
                  <ManageQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rules"
              element={
                <ProtectedRoute adminOnly>
                  <ManageRules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute adminOnly>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/instructors"
              element={
                <ProtectedRoute adminOnly>
                  <ManageInstructors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute adminOnly>
                  <ManageCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/chapters"
              element={
                <ProtectedRoute adminOnly>
                  <AdminChapters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute adminOnly>
                  <ManageCertificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute adminOnly>
                  <ManageAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute adminOnly>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
