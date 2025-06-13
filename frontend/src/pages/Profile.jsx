import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";
import { FaInstagram, FaVk, FaTelegram, FaYoutube, FaGlobe } from "react-icons/fa";

function getSocialIcon(url) {
  if (!url) return <FaGlobe />;
  if (url.includes("instagram.com")) return <FaInstagram className="text-pink-500" />;
  if (url.includes("vk.com")) return <FaVk className="text-blue-500" />;
  if (url.includes("t.me") || url.includes("telegram.me")) return <FaTelegram className="text-blue-400" />;
  if (url.includes("youtube.com")) return <FaYoutube className="text-red-500" />;
  return <FaGlobe />;
}

function getSocialName(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("instagram.com")) return u.pathname.replace("/", "");
    if (u.hostname.includes("vk.com")) return u.pathname.replace("/", "");
    if (u.hostname.includes("t.me") || u.hostname.includes("telegram.me")) return u.pathname.replace("/", "");
    if (u.hostname.includes("youtube.com")) return u.pathname.replace("/", "");
    return url;
  } catch {
    return url;
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [myCourses, setMyCourses] = useState([]);
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const fileInput = useRef();
  const coverInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Пример запроса профиля
    fetch("http://localhost:5000/api/auth/profile", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setProfile(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses/subscriptions", { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(data => setSubscribedCourses(data));
  }, []);

  async function handleLogout() {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  }

  // Загрузка аватара
  async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("http://localhost:5000/api/auth/avatar", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(p => ({ ...p, avatar: data.avatar }));
    }
  }

  // Загрузка cover
  async function uploadCover(file) {
    const formData = new FormData();
    formData.append("cover", file);
    const res = await fetch("http://localhost:5000/api/auth/cover", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(p => ({ ...p, cover: data.cover }));
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name,
        bio: form.bio,
        links: form.links.split(",").map(l => l.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setEdit(false);
    }
  }

  // Получить подробную инфу о подписчиках/подписках
  async function fetchUsersByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const res = await fetch("http://localhost:5000/api/auth/users-by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ids }),
    });
    if (res.ok) return res.json();
    return [];
  }

  // Открыть модалку подписчиков/подписок
  async function openFollowersModal() {
    setShowFollowers(true);
    setFollowersList(await fetchUsersByIds(profile.followers));
    setFollowingList(await fetchUsersByIds(profile.following));
  }

  // Отписаться от пользователя
  async function handleUnfollow(userId) {
    await fetch(`http://localhost:5000/api/auth/user/${userId}/unfollow`, {
      method: "POST",
      credentials: "include",
    });
    setFollowingList(list => list.filter(u => u._id !== userId));
    setProfile(p => ({
      ...p,
      following: p.following.filter(id => id !== userId)
    }));
  }

  if (!profile) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 to-indigo-900">
      <main className="flex-1 flex flex-col">
        {/* Cover (шапка) */}
        <div
          className="relative w-full bg-white bg-opacity-20 flex items-center justify-center"
          style={{ height: 220, cursor: "pointer" }}
          onClick={() => coverInput.current.click()}
          onDrop={e => { e.preventDefault(); uploadCover(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
        >
          {profile.cover ? (
            <img
              src={`http://localhost:5000${profile.cover}`}
              alt="cover"
              className="absolute inset-0 w-full h-full object-cover rounded-b-xl"
              style={{ zIndex: 1 }}
            />
          ) : (
            <span className="text-white text-lg z-10">Перетащите или кликните для загрузки шапки профиля</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={coverInput}
            style={{ display: "none" }}
            onChange={e => uploadCover(e.target.files[0])}
          />
        </div>

        {/* Profile section */}
        <section className="flex flex-col items-center mt-[-60px]">
          {/* Аватар */}
          <div
            className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg mb-2 border-4 border-indigo-900 relative z-20"
            style={{ cursor: "pointer" }}
            onClick={() => fileInput.current.click()}
            onDrop={e => { e.preventDefault(); uploadAvatar(e.dataTransfer.files[0]); }}
            onDragOver={e => e.preventDefault()}
          >
            {profile.avatar ? (
              <img src={`http://localhost:5000${profile.avatar}`} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <UserIcon className="h-16 w-16 text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={e => uploadAvatar(e.target.files[0])}
            />
          </div>
          <div className="text-white text-xl font-semibold">{profile.name || "Имя"}</div>
          <div className="flex gap-6 mt-2 text-indigo-200 justify-center">
            <button
              type="button"
              className="underline hover:text-blue-400 transition"
              onClick={openFollowersModal}
            >
              Подписчики: {profile.followers ? profile.followers.length : 0}
            </button>
            <button
              type="button"
              className="underline hover:text-blue-400 transition"
              onClick={openFollowersModal}
            >
              Подписки: {profile.following ? profile.following.length : 0}
            </button>
          </div>
          <div className="text-indigo-200">{profile.bio || "Добавьте описание"}</div>
          <div className="text-indigo-300 mb-2">{profile.email}</div>
          {/* Ссылки соцсетей */}
          <div className="mt-2 flex flex-col items-center gap-2">
            {profile.links && profile.links.length > 0 ? (
              profile.links.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  className="flex items-center gap-2 text-blue-200 hover:text-blue-400 transition underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(link)}
                  <span className="font-medium">{getSocialName(link)}</span>
                </a>
              ))
            ) : (
              <button
                type="button"
                className="text-blue-400 underline"
                onClick={() => setEdit(true)}
              >
                + добавить соцсети
              </button>
            )}
          </div>
          {/* Кнопка "Редактировать" */}
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setEdit(true)}
          >
            Редактировать
          </button>
        </section>

        {/* Форма редактирования */}
        {edit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <form
              onSubmit={handleSave}
              className="w-full max-w-lg bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border-2 border-blue-400 relative"
              style={{ minWidth: 340 }}
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
                onClick={() => setEdit(false)}
                title="Закрыть"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Редактировать профиль</h2>
              <label className="flex flex-col gap-2 text-white">
                Имя
                <input
                  type="text"
                  placeholder="Имя"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </label>
              <label className="flex flex-col gap-2 text-white">
                Описание
                <textarea
                  placeholder="Описание"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                  rows={3}
                />
              </label>
              <label className="flex flex-col gap-2 text-white">
                Ссылки (через запятую)
                <input
                  type="text"
                  placeholder="Ссылки (через запятую)"
                  value={form.links}
                  onChange={e => setForm(f => ({ ...f, links: e.target.value }))}
                  className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </label>
              <div className="flex gap-4 mt-2 justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-lg transition"
                  onClick={() => setEdit(false)}
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

        {/* Модальное окно подписчиков/подписок */}
        {showFollowers && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="w-full max-w-2xl bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border-2 border-blue-400 relative min-h-[350px]">
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
                onClick={() => setShowFollowers(false)}
                title="Закрыть"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Подписчики и подписки</h2>
              <div className="flex gap-8 justify-center">
                {/* Подписчики */}
                <div className="flex-1">
                  <h3 className="text-lg text-white font-semibold mb-2 text-center">Подписчики</h3>
                  <div className="flex flex-col gap-2">
                    {followersList.length === 0 ? (
                      <div className="text-indigo-200 text-center">Нет подписчиков</div>
                    ) : (
                      followersList.map(u => (
                        <Link
                          key={u._id}
                          to={`/profile/${u._id}`}
                          className="flex items-center gap-2 text-blue-200 hover:text-blue-400 transition underline px-2 py-1 rounded"
                          onClick={() => setShowFollowers(false)}
                        >
                          {u.avatar && (
                            <img src={`http://localhost:5000${u.avatar}`} alt="" className="w-7 h-7 rounded-full object-cover" />
                          )}
                          <span>{u.name || u.username}</span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
                {/* Подписки */}
                <div className="flex-1">
                  <h3 className="text-lg text-white font-semibold mb-2 text-center">Подписки</h3>
                  <div className="flex flex-col gap-2">
                    {followingList.length === 0 ? (
                      <div className="text-indigo-200 text-center">Нет подписок</div>
                    ) : (
                      followingList.map(u => (
                        <div key={u._id} className="flex items-center gap-2 px-2 py-1 rounded group">
                          <Link
                            to={`/profile/${u._id}`}
                            className="flex items-center gap-2 text-blue-200 hover:text-blue-400 transition underline"
                            onClick={() => setShowFollowers(false)}
                          >
                            {u.avatar && (
                              <img src={`http://localhost:5000${u.avatar}`} alt="" className="w-7 h-7 rounded-full object-cover" />
                            )}
                            <span>{u.name || u.username}</span>
                          </Link>
                          <button
                            onClick={() => handleUnfollow(u._id)}
                            className="ml-auto text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 py-1 rounded transition shadow"
                          >
                            Отписаться
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
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

        {/* Horizontal menu */}
        <nav className="flex justify-center gap-6 mt-8 mb-4">
          <button className="text-white hover:text-blue-400 px-2 py-1">Главная</button>
          <button className="text-white hover:text-blue-400 px-2 py-1">Курсы</button>
          <button className="text-white hover:text-blue-400 px-2 py-1">Подписка</button>
          <button className="text-white hover:text-blue-400 px-2 py-1">Магазин</button>
          <button className="text-white hover:text-blue-400 px-2 py-1">Рекомендации</button>
          <button className="text-white hover:text-blue-400 px-2 py-1">О Вас</button>
        </nav>

        {/* Main blocks */}
        <div className="flex flex-col items-center gap-6 px-8">
          {/* Курсы, на которые подписан */}
          <div className="w-full max-w-2xl min-h-32 bg-white bg-opacity-10 rounded-xl mb-4 p-4">
            <h3 className="text-lg text-white font-semibold mb-2">Курсы, на которые вы подписаны</h3>
            {subscribedCourses.length === 0 ? (
              <div className="text-indigo-200">Нет подписок</div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {subscribedCourses.map(course => (
                  <div key={course._id} className="bg-white bg-opacity-20 rounded-xl shadow p-3 w-56 flex flex-col items-center">
                    {course.posterUrl && (
                      <img
                        src={`http://localhost:5000${course.posterUrl}`}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <div className="text-white font-semibold text-center mb-1">{course.title}</div>
                    {course.author && (
                      <div className="text-indigo-200 text-sm mb-2">
                        Автор: {course.author.name || course.author.username}
                      </div>
                    )}
                    <Link
                      to={`/courses/${course._id}`}
                      className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                    >
                      Перейти
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Рекомендации */}
          <div className="w-full max-w-2xl min-h-32 bg-white bg-opacity-10 rounded-xl p-4">
            <h3 className="text-lg text-white font-semibold mb-2">Рекомендации</h3>
            {recommendedCourses.length === 0 ? (
              <div className="text-indigo-200">Нет рекомендаций</div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {recommendedCourses.map(course => (
                  <div key={course._id} className="bg-white bg-opacity-20 rounded p-2 w-48">
                    <div className="text-white font-medium truncate">{course.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}