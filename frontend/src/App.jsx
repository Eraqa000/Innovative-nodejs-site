import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import {
  HomeIcon, UserIcon, ClipboardIcon,
  SparklesIcon, InformationCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import UploadCourse from './pages/UploadCourse'
import Courses from './pages/Courses'
import Subscription from './pages/Subscription'
import UserProfile from './pages/UserProfile'
import CourseDetail from './pages/CourseDetail'
import CourseView from './pages/CourseView'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error('Не авторизован')
        return res.json()
      })
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error('Ошибка при загрузке профиля:', err)
        setProfile(null)
      })
  }, [location.pathname])

  async function handleLogout() {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    navigate('/login')
  }

  if (!profile) {
    return (
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex flex-col py-8 px-4 shadow-2xl min-h-screen fixed left-0 top-0">
        <div className="flex flex-col items-center mb-8">
          <UserIcon className="w-16 h-16 text-indigo-300 mb-2" />
          <div className="flex gap-2">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
              Вход
            </Link>
            <Link to="/register" className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white px-4 py-2 rounded transition">
              Регистрация
            </Link>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800 transition ${location.pathname === "/" ? "bg-indigo-800" : ""}`}>
            <HomeIcon className="w-6 h-6" />
            Главная
          </Link>
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800 transition">
            <UserIcon className="w-6 h-6" />
            Профиль
          </button>
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800 transition">
            <ClipboardIcon className="w-6 h-6" />
            Курсы
          </button>
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800 transition">
            <SparklesIcon className="w-6 h-6" />
            Подписка
          </button>
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800 transition">
            <SparklesIcon className="w-6 h-6" />
            Рекомендации
          </button>
          <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800 transition">
            <InformationCircleIcon className="w-6 h-6" />
            О проекте
          </Link>
        </nav>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex flex-col py-8 px-4 shadow-2xl min-h-screen fixed left-0 top-0">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
          {profile.avatar ? (
            <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${profile.avatar}`} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <UserIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <span className="text-white font-semibold truncate w-full text-center">{profile.name}</span>
      </div>
      <nav className="flex flex-col gap-4 w-full px-4">
        <Link to="/" className="flex items-center gap-3 text-white hover:text-blue-400 px-3 py-2 rounded transition w-full">
          <HomeIcon className="h-6 w-6" />
          <span>Главная</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-3 text-white hover:text-blue-400 px-3 py-2 rounded transition w-full">
          <UserIcon className="h-6 w-6" />
          <span>Профиль</span>
        </Link>
        <Link to="/courses" className="flex items-center gap-3 text-white hover:text-blue-400 px-3 py-2 rounded transition w-full">
          <ClipboardIcon className="h-6 w-6" />
          <span>Курсы</span>
        </Link>
        <Link to="/subscription" className="flex items-center gap-3 text-white hover:text-blue-400 px-3 py-2 rounded transition w-full">
          <SparklesIcon className="h-6 w-6" />
          <span>Подписка</span>
        </Link>
        <Link to="/recommendations" className="flex items-center gap-3 text-white hover:text-blue-400 px-3 py-2 rounded transition w-full">
          <SparklesIcon className="h-6 w-6" />
          <span>Рекомендации</span>
        </Link>
        <Link to="/about" className="flex items-center gap-3 text-white hover:text-blue-400 px-3 py-2 rounded transition w-full">
          <InformationCircleIcon className="h-6 w-6" />
          <span>О Сайте</span>
        </Link>
      </nav>
      <div className="mt-auto w-full px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-600 px-3 py-2 rounded w-full"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          Выйти
        </button>
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <Router>
      <Sidebar />
      <div className="ml-64">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/upload-course" element={<UploadCourse />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/course-view/:id" element={<CourseView />} />
        </Routes>
      </div>
    </Router>
  )
}
