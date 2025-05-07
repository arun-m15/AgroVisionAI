import React from 'react';
import ProfilePage from './ProfilePage';
import './Suggestion.css';

const Suggestion = () => {
  return (
    <div className="suggestion-container">
      <ProfilePage />
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
