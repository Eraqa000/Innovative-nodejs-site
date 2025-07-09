import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";

export default function Home() {
  const [popularCourses, setPopularCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState({ courses: [], users: [] });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    axiosInstance.get("/api/courses?recommended=1")
      .then(res => setPopularCourses(res.data.slice(0, 3)));
  }, []);

  useEffect(() => {
    axiosInstance.get("/api/auth/profile")
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    axiosInstance.get(`/api/search?q=${encodeURIComponent(search)}`)
      .then(res => {
        setSearchResults(res.data);
        setSearching(false);
      });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-700 text-white px-4"
    >
      <div className="w-full max-w-5xl mx-auto py-16">
        {/* Блок преимуществ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white bg-opacity-15 rounded-2xl p-8 flex flex-col items-center shadow-2xl hover:scale-105 transition-transform border border-blue-700">
            <span className="text-4xl mb-4">🎓</span>
            <h3 className="text-xl font-bold mb-2">Учись у лучших</h3>
            <p className="text-indigo-100 text-center">Доступ к уникальным курсам и экспертам. Новые знания — новые возможности!</p>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-8 flex flex-col items-center shadow-2xl hover:scale-105 transition-transform border border-indigo-700">
            <span className="text-4xl mb-4">🚀</span>
            <h3 className="text-xl font-bold mb-2">Создавай и делись</h3>
            <p className="text-indigo-100 text-center">Загружай свои видео, собирай аудиторию и развивай личный бренд.</p>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-8 flex flex-col items-center shadow-2xl hover:scale-105 transition-transform border border-purple-700">
            <span className="text-4xl mb-4">🔒</span>
            <h3 className="text-xl font-bold mb-2">Эксклюзивный доступ</h3>
            <p className="text-indigo-100 text-center">Оформи подписку и получи доступ к приватным материалам и бонусам.</p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link
            to="/courses"
            className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-10 rounded-xl shadow-lg text-lg transition"
          >
            Смотреть курсы
          </Link>
          <Link
            to="/subscription"
            className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-semibold py-4 px-10 rounded-xl shadow-lg text-lg transition"
          >
            Оформить подписку
          </Link>
        </div>

        {/* Поиск */}
        <div className="mb-16">
          <form onSubmit={handleSearch} className="flex justify-center mb-10">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск курсов, видео, пользователей..."
              className="w-full max-w-md px-5 py-3 rounded-l-xl bg-white bg-opacity-20 text-white placeholder-indigo-200 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-r-xl bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold transition"
              disabled={searching}
            >
              {searching ? "Поиск..." : "Найти"}
            </button>
          </form>
        </div>

        {/* Результаты поиска */}
        {(searchResults.courses.length > 0 || searchResults.users.length > 0) && (
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Результаты поиска</h3>
            {searchResults.courses.length > 0 && (
              <div className="mb-6">
                <div className="font-semibold mb-2">Курсы:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.courses.map(course => (
                    <div key={course._id} className="bg-white bg-opacity-10 rounded-xl p-4">
                      <div className="text-white font-medium">{course.title}</div>
                      <div className="text-indigo-200 text-sm">{course.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {searchResults.users.length > 0 && (
              <div>
                <div className="font-semibold mb-2">Пользователи:</div>
                <div className="flex flex-wrap gap-4">
                  {searchResults.users.map(user => (
                    <Link
                      key={user._id}
                      to={`/profile/${user._id}`}
                      className="bg-white bg-opacity-10 rounded-xl p-4 hover:bg-opacity-20 transition block"
                    >
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-indigo-200 text-sm">{user.email}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Популярные курсы */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Популярные курсы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map(course => {
              const isPrivate = course.isPrivate;
              const allowed = !isPrivate || (
                profile &&
                course.allowedSubscriptions &&
                course.allowedSubscriptions.includes(profile.subscription)
              );
              const minSub = course.allowedSubscriptions && course.allowedSubscriptions[0];

              return (
                <div key={course._id} className="bg-white bg-opacity-15 rounded-2xl p-4 flex flex-col items-center shadow-xl relative hover:scale-105 transition-transform border border-indigo-700">
                  <div className="relative pb-[56.25%] w-full mb-3 rounded-xl overflow-hidden bg-black">
                    <video
                      src={`http://localhost:5000${course.videoUrl}`}
                      className={`absolute top-0 left-0 w-full h-full object-cover ${!allowed ? "filter blur-sm brightness-75" : ""}`}
                      poster={course.posterUrl ? `http://localhost:5000${course.posterUrl}` : "/video-placeholder.png"}
                      muted
                    />
                    {!allowed && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-xl">
                        <span className="text-white text-lg font-bold mb-2 drop-shadow">
                          Приобретите {minSub} подписку
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1 truncate">{course.title}</div>
                  <div className="text-indigo-100 text-sm mb-2 line-clamp-2">{course.description}</div>
                  {allowed ? (
                    <Link
                      to="/courses"
                      className="mt-auto bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-1 px-6 rounded-lg shadow transition"
                    >
                      Смотреть
                    </Link>
                  ) : (
                    <button
                      className="mt-auto bg-gray-700 bg-opacity-60 text-white font-semibold py-1 px-6 rounded-lg shadow cursor-not-allowed"
                      disabled
                    >
                      Нет доступа
                    </button>
                  )}
                </div>
              );
            })}
            {popularCourses.length === 0 && (
              <div className="col-span-3 text-indigo-100 text-center">Нет доступных курсов</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}