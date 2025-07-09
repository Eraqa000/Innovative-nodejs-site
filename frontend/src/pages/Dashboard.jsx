import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, notifications: 0 });

  useEffect(() => {
    axiosInstance.get("/api/dashboard/stats")
      .then(res => setStats(res.data))
      .catch(() => setStats({ projects: 0, tasks: 0, notifications: 0 }));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 text-white px-4">
      <div className="bg-white bg-opacity-10 rounded-xl shadow-lg p-8 max-w-xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">Панель управления</h1>
        <p className="text-lg mb-4 text-center">
          Добро пожаловать в панель управления! Здесь вы можете управлять своим аккаунтом и просматривать статистику.
        </p>
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.projects}</span>
            <span className="text-sm text-gray-200">Проектов</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.tasks}</span>
            <span className="text-sm text-gray-200">Задач</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.notifications}</span>
            <span className="text-sm text-gray-200">Уведомления</span>
          </div>
        </div>
      </div>
    </div>
  );
}