import React from "react";
import axiosInstance from "../utils/axiosInstance";

export default function Subscription() {
  // Здесь будет обработка оплаты (заглушка)
  function handleSubscribe() {
    // Пример запроса на backend для оформления подписки (заглушка)
    axiosInstance
      .post("/api/subscription/start")
      .then(() => {
        alert("Подписка успешно оформлена! (заглушка)");
      })
      .catch(() => {
        alert("Ошибка оформления подписки (заглушка)");
      });
    // Тут можно реализовать переход на оплату через Stripe, ЮKassa и т.д.
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white bg-opacity-10 rounded-2xl p-10 shadow-xl max-w-xl w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Подписка</h2>
        <div className="flex flex-col gap-6 mb-6">
          <div className="bg-white bg-opacity-10 rounded-xl p-6">
            <div className="text-xl text-white font-semibold mb-2">Базовая</div>
            <div className="text-indigo-200 mb-2">Доступ к бесплатным курсам</div>
            <div className="text-2xl text-blue-300 font-bold mb-2">Бесплатно</div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 border-2 border-blue-400">
            <div className="text-xl text-white font-semibold mb-2">Премиум</div>
            <div className="text-indigo-100 mb-2">Доступ ко всем курсам, включая приватные</div>
            <div className="text-2xl text-white font-bold mb-4">299₽/мес</div>
            <button
              onClick={handleSubscribe}
              className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition"
            >
              Оформить подписку
            </button>
          </div>
        </div>
        <p className="text-indigo-200 text-sm">После оплаты подписки вы получите доступ к приватным курсам.</p>
      </div>
    </div>
  );
}