import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses?author=me", { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(setCourses);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (poster) formData.append("poster", poster);
    const res = await fetch("http://localhost:5000/api/courses/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setPoster(null);
      setShowForm(false);
      setLoading(false);
      // Здесь тоже должен быть тот же запрос, что и в useEffect:
      fetch("http://localhost:5000/api/courses?author=me", { credentials: "include" })
        .then(res => res.ok ? res.json() : [])
        .then(setCourses);
    } else {
      setLoading(false);
      alert("Ошибка создания курса");
    }
  }

  async function handleDelete(courseId) {
    if (!window.confirm("Вы уверены, что хотите удалить этот курс?")) return;
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) {
      setCourses(courses => courses.filter(c => c._id !== courseId));
    } else {
      alert("Ошибка удаления курса");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Курсы</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          Создать курс
        </button>
      </div>

      {/* Модальная форма создания курса */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border-2 border-blue-400 relative"
            style={{ minWidth: 340 }}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
              onClick={() => setShowForm(false)}
              title="Закрыть"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Создать новый курс</h3>
            <label className="flex flex-col gap-2 text-white">
              Название
              <input
                type="text"
                placeholder="Название"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-white">
              Описание
              <textarea
                placeholder="Описание"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                rows={3}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-white">
              Постер (изображение)
              <input
                type="file"
                accept="image/*"
                onChange={e => setPoster(e.target.files[0])}
                className="p-3 rounded-lg bg-white bg-opacity-20 text-white"
              />
            </label>
            <div className="flex gap-4 mt-2 justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition"
                disabled={loading}
              >
                {loading ? "Создание..." : "Создать"}
              </button>
              <button
                type="button"
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-lg transition"
                onClick={() => setShowForm(false)}
              >
                Отмена
              </button>
            </div>
          </form>
          <style>
            {`
              .animate-fade-in {
                animation: fadeIn 0.25s;
              }
              @keyframes fadeIn {
                from { opacity: 0 }
                to { opacity: 1 }
              }
            `}
          </style>
        </div>
      )}

      {/* Сетка курсов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course._id} className="relative group">
            <CourseCard course={course} />
            <button
              onClick={() => handleDelete(course._id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-3 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
              title="Удалить курс"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}