import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import ProfilePage from './ProfilePage';
import './Suggestion.css';

const Suggestion = () => {
  const navigate = useNavigate(); // ✅ create navigate function

  return (
    <div className="suggestion-container">
      <ProfilePage />

      {/* ✅ Back to Home button */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
        <button className="back-home-button" onClick={() => navigate('/homepage')}>
          🏠 Back to Home
        </button>
      </div>

      <div className="iframe-wrapper">
        <iframe
          src="https://bala00712200502-new-trip-plan.hf.space"
          title="HuggingFaceApp"
          className="responsive-iframe"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Suggestion;
