import React from "react";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white px-4">
      <div className="bg-white bg-opacity-10 rounded-xl shadow-lg p-8 max-w-xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">О сайте</h1>
        <p className="text-lg mb-4 text-center">
          Добро пожаловать на инновационный сайт! Здесь используются современные
          технологии:{" "}
          <span className="font-semibold text-blue-300">React</span>,{" "}
          <span className="font-semibold text-blue-300">Node.js</span> и{" "}
          <span className="font-semibold text-blue-300">Tailwind CSS</span>.
        </p>
        <ul className="list-disc list-inside text-blue-200">
          <li>Быстрая и отзывчивая верстка</li>
          <li>Современный дизайн</li>
          <li>Удобная навигация</li>
        </ul>
      </div>
    </div>
  );
}