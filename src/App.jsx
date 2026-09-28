import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import './styles/app.css';

// The landing page is the entry for most first visits and ships with the main
// bundle. Every other page is its own chunk, fetched when its route is first
// visited, so landing visitors no longer download the editor, the admin
// console or the block renderers.
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditorPage = lazy(() => import('./pages/EditorPage'));

/** Shown while a page chunk downloads. The spinner only appears if it is slow. */
function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-label="Loading">
      <span className="route-fallback-spinner" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </AuthProvider>
  );
}

export default App;
