import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import ProfilePage from './ProfilePage';
import LeafAnalysis from './LeafAnalysis';
import Suggestion from './Suggestion';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leafanalysis" element={<LeafAnalysis />} />
          <Route path="/suggestion" element={<Suggestion />} />
          
          {/* Redirect any unknown route to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
