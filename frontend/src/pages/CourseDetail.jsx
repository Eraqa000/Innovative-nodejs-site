import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";

function VideoCard({ video, idx, courseId, refreshCourse }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить это видео?");
    if (!confirmDelete) return;
    await fetch(`http://localhost:5000/api/courses/${courseId}/video/${idx}`, {
      method: "DELETE",
      credentials: "include"
    });
    refreshCourse();
  };

  return (
    <div className="bg-[#6B6B8D] rounded-xl p-4 flex flex-col items-center relative">
      <video
        src={`http://localhost:5000${video.url}`}
        controls
        className="w-full h-32 rounded bg-black mb-2"
        poster={video.poster ? `http://localhost:5000${video.poster}` : undefined}
      />
      <div className="text-white font-semibold">{video.title || "Видео"}</div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-3 py-1 text-xs"
      >
        Удалить
      </button>
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPoster, setVideoPoster] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [subscribed, setSubscribed] = useState(false);
  const [userId, setUserId] = useState(null);

  const refreshCourse = () => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setCourse(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshCourse();
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/profile", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        if (user) {
          setUserId(user._id);
          if (course && user.subscribedCourses?.includes(course._id)) {
            setSubscribed(true);
          }
        }
      });
  }, [course]);

  useEffect(() => {
    if (course && userId && course.author !== userId) {
      navigate(`/course-view/${course._id}`);
    }
  }, [course, userId, navigate]);

  async function handleVideoUpload(e) {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("video", videoFile);
    if (videoPoster) formData.append("poster", videoPoster);
    formData.append("courseId", id);
    const res = await fetch("http://localhost:5000/api/courses/upload-video", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.ok) {
      setShowForm(false);
      setVideoTitle("");
      setVideoDescription("");
      setVideoFile(null);
      setVideoPoster(null);
      refreshCourse();
    } else {
      alert("Ошибка загрузки видео");
    }
    setUploading(false);
  }

  async function handleSubscribe() {
    await fetch(`http://localhost:5000/api/courses/${course._id}/subscribe`, {
      method: "POST",
      credentials: "include"
    });
    setSubscribed(true);
  }

  async function handleUnsubscribe() {
    await fetch(`http://localhost:5000/api/courses/${course._id}/unsubscribe`, {
      method: "POST",
      credentials: "include"
    });
    setSubscribed(false);
  }

  if (loading) return <div className="text-white p-8">Загрузка...</div>;
  if (!course) return <div className="text-white p-8">Курс не найден</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 px-8 py-8">
      {/* Шапка курса */}
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
              <UserIcon className="w-16 h-16 text-indigo-300" />
            )}
          </div>
          <div className="mt-16">
            <div className="text-white text-3xl font-bold">{course.title}</div>
            <div className="text-indigo-200">{course.description || "Добавьте описание"}</div>
          </div>
        </div>
      </div>
      <div className="h-16" />

      {/* Кнопка загрузки видео */}
      {userId && course.author === userId && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-indigo-900 font-semibold px-6 py-2 rounded-full shadow hover:bg-indigo-100 transition"
          >
            Загрузить видео
          </button>
        </div>
      )}

      {/* Кнопка подписки */}
      {userId && course.author !== userId && (
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
      )}

      {/* Форма модалки */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <form
            onSubmit={handleVideoUpload}
            className="w-full max-w-lg bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border-2 border-blue-400 relative"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
              onClick={() => setShowForm(false)}
              title="Закрыть"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Загрузить видео</h3>
            <label className="flex flex-col gap-2 text-white">
              Название видео
              <input
                type="text"
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                className="p-3 rounded-lg bg-white bg-opacity-20 text-white"
                disabled={uploading}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-white">
              Описание видео
              <textarea
                value={videoDescription}
                onChange={e => setVideoDescription(e.target.value)}
                className="p-3 rounded-lg bg-white bg-opacity-20 text-white resize-none"
                rows={3}
                disabled={uploading}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-white">
              Видео
              <input
                type="file"
                accept="video/*"
                onChange={e => setVideoFile(e.target.files[0])}
                className="p-3 rounded-lg bg-white bg-opacity-20 text-white"
                disabled={uploading}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-white">
              Постер (необязательно)
              <input
                type="file"
                accept="image/*"
                onChange={e => setVideoPoster(e.target.files[0])}
                className="p-3 rounded-lg bg-white bg-opacity-20 text-white"
                disabled={uploading}
              />
            </label>
            <div className="flex gap-4 justify-center mt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-lg"
                disabled={uploading}
              >
                {uploading ? "Загрузка..." : "Загрузить"}
              </button>
              <button
                type="button"
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-lg"
                onClick={() => setShowForm(false)}
              >
                Отмена
              </button>
            </div>
          </form>
          <style>{`
            .animate-fade-in {
              animation: fadeIn 0.25s ease-in-out;
            }
            @keyframes fadeIn {
              from { opacity: 0 }
              to { opacity: 1 }
            }
          `}</style>
        </div>
      )}

      {/* Сетка видео */}
      <div className="rounded-2xl bg-white bg-opacity-10 p-8 mt-4">
        <div className="text-white text-xl font-semibold mb-6">Видео</div>
        {Array.isArray(course.videos) && course.videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {course.videos.map((video, idx) => (
              <VideoCard
                key={idx}
                video={video}
                idx={idx}
                courseId={course._id}
                refreshCourse={refreshCourse}
              />
            ))}
          </div>
        ) : (
          <div className="text-indigo-200">Нет видео в этом курсе</div>
        )}
      </div>
    </div>
  );
}
