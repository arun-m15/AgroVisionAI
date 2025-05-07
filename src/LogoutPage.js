import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from './firebase';

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (err) {
        console.error('Logout error:', err);
        navigate('/');
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Logging out...</h2>
        <p>Please wait while we sign you out.</p>
      </div>
    </div>
  );
}

export default LogoutPage;