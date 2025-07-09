import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function UploadCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowedSubscriptions, setAllowedSubscriptions] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    formData.append("isPrivate", isPrivate);
    formData.append("allowedSubscriptions", allowedSubscriptions);
    try {
      await axiosInstance.post("/api/courses/upload", formData);
      alert("Курс загружен!");
    } catch {
      alert("Ошибка загрузки курса");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 bg-white bg-opacity-10 p-8 rounded-xl text-white flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Загрузить курс</h2>
      <input type="text" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} className="p-2 rounded text-black" required />
      <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} className="p-2 rounded text-black" required />
      <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} className="p-2 rounded text-black" required />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
        Приватный курс (только для подписчиков)
      </label>
      {isPrivate && (
        <input type="text" placeholder="Типы подписки через запятую (например: premium,pro)" value={allowedSubscriptions} onChange={e => setAllowedSubscriptions(e.target.value)} className="p-2 rounded text-black" />
      )}
      <button className="bg-blue-600 rounded py-2">Загрузить</button>
    </form>
  );
}