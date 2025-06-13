import React from "react";

export default function About() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full transition">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center">
          О проекте
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-6 text-center text-blue-100">
          Добро пожаловать на наш инновационный образовательный сайт! Мы объединили
          <span className="font-semibold text-blue-300"> React</span>,{" "}
          <span className="font-semibold text-blue-300">Node.js</span> и{" "}
          <span className="font-semibold text-blue-300">Tailwind CSS</span> для создания
          удобного, современного и производительного интерфейса.
        </p>
        <ul className="list-disc list-inside space-y-2 text-blue-200 text-base sm:text-lg">
          <li>Быстрая и адаптивная верстка</li>
          <li>Современный, минималистичный дизайн</li>
          <li>Удобная и понятная навигация</li>
          <li>Функционал для авторизации, курсов и рекомендаций</li>
        </ul>
      </div>
    </section>
  );
}
