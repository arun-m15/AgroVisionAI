import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './profilepage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  // Get current user on component mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="top-nav">
      <div className="nav-left">
        <span className="brand-name">AgroVisionAI</span>
      </div>
      {/* Removed nav-links (Home, Suggestions) and nav-actions (Language, Profile) */}
    </div>
  );
}

export default ProfilePage;
