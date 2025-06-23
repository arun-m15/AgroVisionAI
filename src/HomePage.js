import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import './HomePage.css';

function HomePage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState('Locating...');
  const navigate = useNavigate();

  const API_KEY = '0f39ba75669e0f240beb542ef6f34686';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          fetchWeatherData(coords.latitude, coords.longitude);
          reverseGeocode(coords.latitude, coords.longitude);
        },
        () => {
          setUserLocation("Location not available");
          fetchWeatherData(40.7128, -74.0060);
        }
      );
    } else {
      setUserLocation("Geolocation not supported");
      fetchWeatherData(40.7128, -74.0060);
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('Weather data not available');
      const data = await res.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setUserLocation(`${data[0].name}, ${data[0].country}`);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  return (
    <div className="homepage-container">
      <ProfilePage />

      <main className="homepage-main two-column-layout">
        {/* 🌦️ Weather Section - Left */}
        <div className="left-panel">
          {loading ? (
            <div className="weather-loading">Loading weather data...</div>
          ) : error ? (
            <div className="weather-error">Error: {error}</div>
          ) : (
            <>
              <div className="weather-box location-box">
                <div className="weather-icon">📍</div>
                <h3>Location</h3>
                <p className="weather-value">{userLocation}</p>
              </div>
              <div className="weather-box humidity-box">
                <div className="weather-icon">💧</div>
                <h3>Humidity</h3>
                <p className="weather-value">{weatherData?.main?.humidity}%</p>
              </div>
              <div className="weather-box precipitation-box">
                <div className="weather-icon">🌧️</div>
                <h3>Precipitation</h3>
                <p className="weather-value">
                  {weatherData?.rain?.['1h'] ? `${weatherData.rain['1h']}mm` : '0mm'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* 🤖 AgroVision Details + Buttons - Right */}
        <div className="right-panel">
          <div className="welcome-header">
            <h1>Welcome to AgroVisionAI</h1>
            <p className="welcome-subtitle">
              AgroVisionAI is an intelligent agricultural platform that combines AI analysis with 
              real-time environmental data to optimize your farming operations and increase yields.
            </p>
          </div>

          <div className="action-buttons">
            <button className="action-button" onClick={() => navigate('/leafanalysis')}>
              🧪 Analysis
            </button>
            <button className="action-button" onClick={() => navigate('/suggestion')}>
              💡 Suggestions
            </button>
          </div>

          {/* 🌡️ Moved Weather Cards to Right Panel */}
          {weatherData && (
            <div className="additional-weather">
              <div className="weather-card"><h4>Temperature</h4><p>{weatherData.main.temp}°C</p></div>
              <div className="weather-card"><h4>Feels Like</h4><p>{weatherData.main.feels_like}°C</p></div>
              <div className="weather-card"><h4>Wind Speed</h4><p>{weatherData.wind.speed} m/s</p></div>
              <div className="weather-card"><h4>Conditions</h4><p>{weatherData.weather[0].main}</p></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
