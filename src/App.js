import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';

import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import LogoutPage from './LogoutPage';
import LeafAnalysis from './LeafAnalysis';
import Suggestion from './Suggestion';
import Dashboard from './Dashboard'; // ✅ Import Dashboard
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/leafanalysis" element={<LeafAnalysis />} />
          <Route path="/suggestion" element={<Suggestion />} />

          {/* ✅ Main route: show both HomePage and ProfilePage if user is logged in */}
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
