import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Members from './pages/Members';
import Benefits from './pages/Benefits';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Certificate from './pages/Certificate';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Courses from './pages/Courses';

function setFaviconByTheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const color = isDark ? "#fff" : "#000";
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = color;
    // Path segitiga play FaPlay (FontAwesome)
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.scale(2.5, 2.5); // Perbesar agar proporsional
    ctx.beginPath();
    ctx.moveTo(-7, -12);
    ctx.lineTo(11, 0);
    ctx.lineTo(-7, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  let favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    document.head.appendChild(favicon);
  }
  if (favicon instanceof HTMLLinkElement) {
    favicon.rel = "icon";
    favicon.href = canvas.toDataURL("image/png");
  }
}

function useDynamicFavicon() {
  useEffect(() => {
    setFaviconByTheme();
    const listener = () => setFaviconByTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    };
  }, []);
}

function App() {
  useDynamicFavicon();
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/certificate/:credential" element={<Certificate />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;