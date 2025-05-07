import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './profilepage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [language, setLanguage] = useState('english');
  const [userEmail, setUserEmail] = useState('');
  const profileDropdownRef = useRef();
  const languageDropdownRef = useRef();

  // Get current user on component mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);
  const toggleLanguageDropdown = () => setShowLanguageDropdown(!showLanguageDropdown);
  
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
    // You might want to save language preference to localStorage here
    // localStorage.setItem('preferredLanguage', lang);
  };

  const translations = {
    english: {
      home: "Home",
      analysis: "Analysis",
      suggestions: "Suggestions",
      logout: "Logout"
    },
    tamil: {
      home: "முகப்பு",
      analysis: "பகுப்பாய்வு",
      suggestions: "பரிந்துரைகள்",
      logout: "வெளியேறு"
    },
    hindi: {
      home: "होम",
      analysis: "विश्लेषण",
      suggestions: "सुझाव",
      logout: "लॉग आउट"
    },
    telugu: {
      home: "హోమ్",
      analysis: "విశ్లేషణ",
      suggestions: "సూచనలు",
      logout: "లాగ్అవుట్"
    },
    malayalam: {
      home: "ഹോം",
      analysis: "വിശകലനം",
      suggestions: "നിർദ്ദേശങ്ങൾ",
      logout: "ലോഗൗട്ട്"
    }
  };

  const languageDisplayNames = {
    english: "English",
    tamil: "தமிழ்",
    hindi: "हिंदी",
    telugu: "తెలుగు",
    malayalam: "മലയാളം"
  };

  return (
    <div className="top-nav">
      <div className="nav-left">
        <span className="brand-name">AgroVisionAI</span>
      </div>
      <div className="nav-right">
        <div className="nav-links">
          <Link to="/homepage" className="nav-button">{translations[language].home}</Link>
          <Link to="/leafanalysis" className="nav-button">{translations[language].analysis}</Link>
          <Link to="/suggestion" className="nav-button">{translations[language].suggestions}</Link>
        </div>
        <div className="nav-actions">
          <div className="language-dropdown" ref={languageDropdownRef}>
            <button className="language-button" onClick={toggleLanguageDropdown}>
              <span className="world-icon">🌐</span> {languageDisplayNames[language]} ▼
            </button>
            {showLanguageDropdown && (
              <div className="dropdown-menu language-menu">
                <button onClick={() => changeLanguage('english')}>English</button>
                <button onClick={() => changeLanguage('tamil')}>தமிழ் (Tamil)</button>
                <button onClick={() => changeLanguage('hindi')}>हिंदी (Hindi)</button>
                <button onClick={() => changeLanguage('telugu')}>తెలుగు (Telugu)</button>
                <button onClick={() => changeLanguage('malayalam')}>മലയാളം (Malayalam)</button>
              </div>
            )}
          </div>
          <div className="profile-dropdown" ref={profileDropdownRef}>
            <button className="profile-button" onClick={toggleProfileDropdown}>
              <span className="profile-icon">👨‍🌾</span>
            </button>
            {showProfileDropdown && (
              <div className="dropdown-menu profile-menu">
                <div className="user-email">{userEmail}</div>
                <button onClick={handleLogout} className="logout-button">
                  {translations[language].logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;