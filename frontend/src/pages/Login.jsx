import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    if (res.ok) {
      navigate("/profile");
    } else {
      setError("Неверный логин или пароль");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      <form
        className="bg-white bg-opacity-10 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4"
        onSubmit={handleLogin}
      >
        <h1 className="text-3xl font-bold text-center text-white mb-4">Вход</h1>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
        >
          Войти
        </button>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <p className="text-center text-gray-300 text-sm mt-2">
          Нет аккаунта?{" "}
          <a
            href="/register"
            className="text-blue-400 underline"
          >
            Зарегистрируйтесь
          </a>
        </p>
      </form>
    </div>
  );
}