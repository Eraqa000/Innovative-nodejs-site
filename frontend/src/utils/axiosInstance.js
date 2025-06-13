import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // из .env файла
  withCredentials: true, // позволяет передавать cookie (сессии)
});

export default axiosInstance;
