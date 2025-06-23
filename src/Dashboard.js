// Dashboard.js
import React from 'react';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-fullscreen">
      <div className="half-panel">
        <HomePage />
      </div>
      <div className="half-panel">
        <ProfilePage />
      </div>
    </div>
  );
}

export default Dashboard;
