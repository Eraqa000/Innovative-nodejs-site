import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/api/courses/${id}`)
      .then(res => {
        setCourse(res.data);
        setLoading(false);
      });
    // Проверка подписки (можно доработать под вашу логику)
    axiosInstance.get("/api/auth/profile")
      .then(res => {
        const user = res.data;
        if (user && user.subscribedCourses?.includes(id)) setSubscribed(true);
      });
  }, [id]);

  async function handleSubscribe() {
    await axiosInstance.post(`/api/courses/${id}/subscribe`);
    setSubscribed(true);
  }

  async function handleUnsubscribe() {
    await axiosInstance.post(`/api/courses/${id}/unsubscribe`);
    setSubscribed(false);
  }

  if (loading) return <div className="text-white p-8">Загрузка...</div>;
  if (!course) return <div className="text-white p-8">Курс не найден</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 px-8 py-8">
      <div className="relative mb-12">
        <div className="h-36 bg-indigo-800 rounded-2xl w-full"></div>
        <div className="absolute left-8 -bottom-12 flex items-end gap-6">
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-indigo-900">
            {course.posterUrl ? (
              <img
                src={`http://localhost:5000${course.posterUrl}`}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-indigo-300 rounded-full" />
            )}
          </div>
          <div className="mt-16">
            <div className="text-white text-3xl font-bold">{course.title}</div>
            <div className="text-indigo-200">{course.description || "Описание отсутствует"}</div>
          </div>
        </div>
      </div>
      <div className="h-16" />

      <div className="flex justify-end mb-6">
        {subscribed ? (
          <button
            onClick={handleUnsubscribe}
            className="bg-gray-700 text-white px-6 py-2 rounded-full shadow hover:bg-gray-800 transition"
          >
            Отписаться
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
          >
            Подписаться
          </button>
        )}
      </div>

      <div className="rounded-2xl bg-white bg-opacity-10 p-8 mt-4">
        <div className="text-white text-xl font-semibold mb-6">Видео</div>
        {Array.isArray(course.videos) && course.videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {course.videos.map((video, idx) => (
              <div key={idx} className="bg-[#6B6B8D] rounded-xl p-4 flex flex-col items-center">
                <video
                  src={`http://localhost:5000${video.url}`}
                  controls
                  className="w-full h-32 rounded bg-black mb-2"
                  poster={video.poster ? `http://localhost:5000${video.poster}` : undefined}
                />
                <div className="text-white font-semibold">{video.title || "Видео"}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-indigo-200">Нет видео в этом курсе</div>
        )}
      </div>
    </div>
  );
}