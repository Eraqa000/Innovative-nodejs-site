import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard"; // Импорт карточки курса

const socialIcons = {
  instagram: (
    <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect width="20" height="20" x="2" y="2" rx="5" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.5" fill="currentColor" />
    </svg>
  ),
  telegram: (
    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M22 4L12 20l-4-7-7-2z" strokeWidth="2" />
    </svg>
  ),
};

function getSocialIcon(link) {
  if (link.includes("instagram.com")) return socialIcons.instagram;
  if (link.includes("t.me") || link.includes("telegram.me")) return socialIcons.telegram;
  return (
    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M8 12h8" strokeWidth="2" />
    </svg>
  );
}

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/user/${id}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data));
    fetch(`http://localhost:5000/api/courses?author=${id}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(data => setCourses(data));
    fetch("http://localhost:5000/api/auth/profile", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setProfile(data));
    // Получить курсы, на которые подписан пользователь (если это свой профиль)
    if (profile && profile._id === id) {
      fetch("http://localhost:5000/api/courses/subscriptions", { credentials: "include" })
        .then(res => res.ok ? res.json() : [])
        .then(setSubscriptions);
    }
  }, [id, profile]);

  useEffect(() => {
    if (user && profile) {
      setSubscribed(user.followers && user.followers.includes(profile._id));
    }
  }, [user, profile]);

  const handleSubscribe = async () => {
    await fetch(`http://localhost:5000/api/auth/user/${id}/follow`, {
      method: "POST",
      credentials: "include"
    });
    setUser(prev => ({
      ...prev,
      followers: [...(prev.followers || []), profile._id]
    }));
    setSubscribed(true);
  };

  const handleUnsubscribe = async () => {
    await fetch(`http://localhost:5000/api/auth/user/${id}/unfollow`, {
      method: "POST",
      credentials: "include"
    });
    setUser(prev => ({
      ...prev,
      followers: (prev.followers || []).filter(f => f !== profile._id)
    }));
    setSubscribed(false);
  };

  if (!user) return <div className="text-white text-center py-10">Загрузка...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-700 px-4">
      <div className="w-full max-w-3xl mx-auto py-10">
        <div className="relative bg-white bg-opacity-10 rounded-xl p-8 text-center mb-8">
          {user.cover && (
            <img
              src={`http://localhost:5000${user.cover}`}
              alt="cover"
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          )}
          <div className="flex flex-col items-center -mt-16">
            <img
              src={user.avatar ? `http://localhost:5000${user.avatar}` : "/avatar-placeholder.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-indigo-700 object-cover bg-white mb-2"
            />
            <h2 className="text-2xl font-bold text-white mb-1">{user.name || user.username}</h2>
            <div className="text-indigo-200 mb-2">{user.bio}</div>
            <div className="text-indigo-300 mb-2">{user.email}</div>
            {/* Соцсети */}
            {user.links && user.links.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center mb-2">
                {user.links.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition"
                  >
                    {getSocialIcon(link)}
                    <span className="text-blue-200 text-sm hidden sm:inline">
                      {link.includes("instagram.com") && "Instagram"}
                      {link.includes("t.me") && "Telegram"}
                      {link.includes("telegram.me") && "Telegram"}
                    </span>
                  </a>
                ))}
              </div>
            )}
            {/* Кнопки подписки/отписки */}
            {profile && profile._id !== user._id && (
              <div className="flex gap-2 mt-2 justify-center">
                {subscribed ? (
                  <>
                    <button
                      disabled
                      className="px-6 py-2 rounded-lg font-semibold shadow bg-gray-500 text-white cursor-not-allowed"
                    >
                      Вы подписаны
                    </button>
                    <button
                      onClick={handleUnsubscribe}
                      className="px-6 py-2 rounded-lg font-semibold shadow bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition"
                    >
                      Отписаться
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    className="px-6 py-2 rounded-lg font-semibold shadow bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white transition"
                  >
                    Подписаться
                  </button>
                )}
              </div>
            )}
            {/* Показываем количество подписчиков и подписок */}
            <div className="flex gap-6 mt-4 text-indigo-200 justify-center">
              <span>Подписчики: {user.followers ? user.followers.length : 0}</span>
              <span>Подписки: {user.following ? user.following.length : 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Курсы пользователя</h3>
          {courses.length === 0 ? (
            <div className="text-indigo-200">Нет курсов</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {courses.map(course => (
                <div
                  key={course._id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>

        {profile && profile._id === user._id && (
          <div className="bg-white bg-opacity-10 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Мои подписки</h3>
            {subscriptions.length === 0 ? (
              <div className="text-indigo-200">Нет подписок</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {subscriptions.map(course => (
                  <div
                    key={course._id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}