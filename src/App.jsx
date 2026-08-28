import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import EditorPage from './pages/EditorPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Dashboard & Admin */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* Profile & Editor routes - accepts both /username and /@username */}
        <Route path="/:username/edit" element={<EditorPage />} />
        <Route path="/:username" element={<ProfilePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
