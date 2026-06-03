import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://social-media-backend-cknm.onrender.com/",
  timeout: 15000,
});

// Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ── Posts ─────────────────────────────────────────────────
export const getFeed = (page = 1) =>
  API.get(`/posts?page=${page}&limit=20`);

export const createPost = (formData) =>
  API.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePost = (postId) => API.delete(`/posts/${postId}`);

export const toggleLike = (postId) => API.post(`/posts/${postId}/like`);

export const addComment = (postId, text) =>
  API.post(`/posts/${postId}/comment`, { text });

export const deleteComment = (postId, commentId) =>
  API.delete(`/posts/${postId}/comment/${commentId}`);

export default API;
