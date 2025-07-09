// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const fetchWithCredentials = (endpoint, options = {}) =>
  fetch(`${API_URL}/api${endpoint}`, {
    credentials: "include",
    ...options,
  });
