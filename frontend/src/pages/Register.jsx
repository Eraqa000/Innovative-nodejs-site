// src/pages/Register.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    try {
      await axiosInstance.post("/api/auth/register", { username, password });
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Ошибка регистрации");
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-teal-900">
      <form
        className="bg-white bg-opacity-10 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4"
        onSubmit={handleRegister}
      >
        <h1 className="text-3xl font-bold text-center text-white mb-4">Регистрация</h1>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
        >
          Зарегистрироваться
        </button>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <p className="text-center text-gray-300 text-sm mt-2">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-green-300 underline">
            Войти
          </a>
        </p>
      </form>
    </div>
  );
}
