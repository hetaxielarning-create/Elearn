import axios from "axios";
import { API_BASE_URL, TOKEN_KEY } from "../utils/constants";

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("elearn_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Endpoints below are matched exactly to your uploaded controllers.
// ---------------------------------------------------------------------------

// ---------- Auth ----------
// One login endpoint for both roles — backend returns { role: 'student' | 'admin', ... }
export const registerStudent = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// ---------- Courses ----------
export const getCourses = (search) =>
  api.get("/courses", { params: search ? { search } : {} });
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post("/courses", data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// ---------- Learning Materials ----------
// content is a plain text/link field on the model (not a file upload yet)
export const getMaterialsByCourse = (courseId, level) =>
  api.get(`/materials/course/${courseId}`, { params: level ? { level } : {} });
// MODIFIED: now sends multipart/form-data so an optional file upload can
// travel alongside the text fields. Build the FormData from the calling
// page — course/title/type/level always as strings, "file" only if the
// instructor/admin chose to upload one instead of pasting a link.
// FIXED: don't manually set Content-Type here — when the body is a
// FormData object, the browser must set this header itself (it includes a
// unique multipart "boundary" value that can't be set by hand). Forcing
// the header ourselves risks a malformed multipart request that the
// server's multer middleware can silently fail to parse correctly.
export const createMaterial = (formData) => api.post("/materials", formData);
export const updateMaterial = (id, formData) =>
  api.put(`/materials/${id}`, formData);
export const deleteMaterial = (id) => api.delete(`/materials/${id}`);

// ---------- Quizzes ----------
export const getQuizzesByCourse = (courseId) =>
  api.get(`/quizzes/course/${courseId}`);
export const getQuizById = (id) => api.get(`/quizzes/${id}`);
// answers = array of selected option indexes, in question order
export const submitQuiz = (id, answers) =>
  api.post(`/quizzes/${id}/submit`, { answers });
export const getMyResults = () => api.get("/quizzes/results/me");
export const createQuiz = (data) => api.post("/quizzes", data);
export const updateQuiz = (id, data) => api.put(`/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/quizzes/${id}`);

// ---------- Recommendations ----------
// Latest recommendation for the logged-in student, for a given course
export const getRecommendationForCourse = (courseId) =>
  api.get(`/recommendations/course/${courseId}`);
export const getRules = () => api.get("/recommendations/rules");
export const createRule = (data) => api.post("/recommendations/rules", data);
export const updateRule = (id, data) =>
  api.put(`/recommendations/rules/${id}`, data);
export const deleteRule = (id) => api.delete(`/recommendations/rules/${id}`);

// ---------- Progress ----------
export const getMyProgress = () => api.get("/progress/me");

// ---------- Profile ----------
export const updateProfile = (data) => api.put("/auth/profile", data);
export const changePassword = (data) => api.put("/auth/change-password", data);

// ---------- Enrollment ----------
export const enrollInCourse = (courseId) =>
  api.post(`/enrollments/${courseId}`);
export const getMyEnrollments = () => api.get("/enrollments/my");
export const checkEnrollment = (courseId) =>
  api.get(`/enrollments/course/${courseId}/check`);

// ---------- Chapters / Topics / Subtopics ----------
export const getChaptersByCourse = (courseId) =>
  api.get(`/chapters/course/${courseId}`);
export const createChapter = (data) => api.post("/chapters", data);
export const updateChapter = (chapterId, data) =>
  api.put(`/chapters/${chapterId}`, data);
export const deleteChapter = (chapterId) =>
  api.delete(`/chapters/${chapterId}`);
export const addTopic = (chapterId, data) =>
  api.post(`/chapters/${chapterId}/topics`, data);
export const updateTopic = (chapterId, topicId, data) =>
  api.put(`/chapters/${chapterId}/topics/${topicId}`, data);
export const deleteTopic = (chapterId, topicId) =>
  api.delete(`/chapters/${chapterId}/topics/${topicId}`);
export const addSubtopic = (chapterId, topicId, data) =>
  api.post(`/chapters/${chapterId}/topics/${topicId}/subtopics`, data);
export const updateSubtopic = (chapterId, topicId, subtopicId, data) =>
  api.put(
    `/chapters/${chapterId}/topics/${topicId}/subtopics/${subtopicId}`,
    data
  );
export const deleteSubtopic = (chapterId, topicId, subtopicId) =>
  api.delete(
    `/chapters/${chapterId}/topics/${topicId}/subtopics/${subtopicId}`
  );

// ---------- Instructor (scoped to their own courses) ----------
export const getMyCourses = () => api.get("/instructor/courses");
export const getInstructorCourseResults = (courseId) =>
  api.get(`/instructor/courses/${courseId}/results`);
export const getInstructorCourseProgress = (courseId) =>
  api.get(`/instructor/courses/${courseId}/progress`);

// ---------- Categories ----------
export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ---------- Certificates ----------
export const issueCertificate = (courseId) =>
  api.post(`/certificates/course/${courseId}`);
export const getMyCertificates = () => api.get("/certificates/my");
export const getAllCertificates = () => api.get("/certificates");
// Downloads the PDF as a blob so the browser can save/open it directly.
export const downloadCertificate = (id) =>
  api.get(`/certificates/${id}/download`, { responseType: "blob" });

// ---------- Notifications / Announcements ----------
export const getMyNotifications = () => api.get("/notifications/my");
export const getAllNotifications = () => api.get("/notifications");
export const createNotification = (data) => api.post("/notifications", data);
export const updateNotification = (id, data) =>
  api.put(`/notifications/${id}`, data);
export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);

// ---------- Analytics ----------
export const getAnalyticsOverview = () => api.get("/analytics/overview");

// ---------- Admin ----------
export const getStudents = () => api.get("/admin/students");
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);
export const getInstructors = () => api.get("/admin/instructors");
export const createInstructor = (data) => api.post("/admin/instructors", data);
export const deleteInstructor = (id) => api.delete(`/admin/instructors/${id}`);
export const toggleUserActive = (id) =>
  api.put(`/admin/users/${id}/toggle-active`);
export const getAllResults = () => api.get("/admin/results");

export default api;
