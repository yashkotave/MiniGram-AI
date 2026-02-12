import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Authentication from './pages/Authentication'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Authentication Route - only show if not logged in */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Authentication />
          )
        }
      />

      {/* Public Home Route - visible to everyone */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-white dark:bg-slate-950">
            <Navbar />
            <Home />
          </div>
        }
      />

      {/* Public Explore Route */}
      <Route
        path="/explore"
        element={
          <div className="min-h-screen bg-white dark:bg-slate-950">
            <Navbar />
            <Explore />
          </div>
        }
      />

      {/* Protected Routes - require authentication */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-white dark:bg-slate-950">
              <Navbar />
              <Profile />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:username"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-white dark:bg-slate-950">
              <Navbar />
              <Profile />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

