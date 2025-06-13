import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    credentials: "include",
  })
    .then((res) => setIsAuth(res.ok))
    .catch(() => setIsAuth(false))
    .finally(() => setLoading(false));
}, []);


  if (loading) return null; // или спиннер
  return isAuth ? children : <Navigate to="/login" />;
}
