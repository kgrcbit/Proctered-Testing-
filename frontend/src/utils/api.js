import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Auth
export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);

// Helpers
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
const localAuthHeader = () => {
  const token = localStorage.getItem("token");
  return authHeader(token || "");
};

// Admin
export const createFaculty = (data, token) =>
  API.post("/admin/faculty", data, authHeader(token));

export const listFaculty = (token) =>
  API.get("/admin/faculty", authHeader(token));

// Faculty - Exams
export const listMyExams = () => API.get("/exams", localAuthHeader());
export const createExam = (payload) =>
  API.post("/exams", payload, localAuthHeader());
export const getExam = (id) => API.get(`/exams/${id}`, localAuthHeader());
export const updateExam = (id, payload) =>
  API.put(`/exams/${id}`, payload, localAuthHeader());
export const deleteExam = (id) => API.delete(`/exams/${id}`, localAuthHeader());
