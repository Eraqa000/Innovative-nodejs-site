import axios from 'axios';

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://innovative-nodejs-site-1.onrender.com"
    : "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL, // из .env файла
  withCredentials: true, // позволяет передавать cookie (сессии)
});

export default axiosInstance;
export { API_URL };
