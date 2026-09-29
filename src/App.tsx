import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { testSupabaseConnection } from './lib/supabaseClient';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SkillMatch from './pages/SkillMatch';
import Sessions from './pages/Sessions';
import Certificates from './pages/Certificates';
import Career from './pages/Career';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './index.css';

import ProtectedRoute from './components/ProtectedRoute';

export function App() {
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/skill-match" element={<ProtectedRoute><SkillMatch /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
          <Route path="/career" element={<ProtectedRoute><Career /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Convenient Aliases for Compatibility */}
          <Route path="/ai-matching" element={<Navigate to="/skill-match" replace />} />
          <Route path="/career-hub" element={<Navigate to="/career" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
