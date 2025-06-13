import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => setIsAuth(res.ok))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // или спиннер
  return isAuth ? children : <Navigate to="/login" />;
}