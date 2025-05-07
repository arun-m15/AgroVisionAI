import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import LogoutPage from './LogoutPage';
import ProfilePage from './ProfilePage';
import HomePage from './HomePage';
import LeafAnalysis from './LeafAnalysis';
import Suggestion from './Suggestion';
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
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/profile" /> : <SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/profile" : "/login"} />} />

          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/leafanalysis" element={<LeafAnalysis />} />
          <Route path="/suggestion" element={<Suggestion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;