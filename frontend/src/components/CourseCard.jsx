import React from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="block bg-white bg-opacity-10 rounded-lg overflow-hidden shadow hover:bg-opacity-20 transition"
    >
      <img
        src={course.posterUrl ? `${API_URL}${course.posterUrl}` : "/video-placeholder.png"}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <div className="text-white font-semibold text-lg mb-1">{course.title}</div>
        <div className="text-indigo-200 text-sm">{course.description}</div>
      </div>
    </Link>
  );
}
