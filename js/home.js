document.addEventListener('DOMContentLoaded', function() {
  const API_KEY = '0f39ba75669e0f240beb542ef6f34686';
  
  // DOM Elements
  const locationEl = document.getElementById('location');
  const humidityEl = document.getElementById('humidity');
  const precipitationEl = document.getElementById('precipitation');
  const temperatureEl = document.getElementById('temperature');
  const feelsLikeEl = document.getElementById('feelsLike');
  const windSpeedEl = document.getElementById('windSpeed');
  const conditionsEl = document.getElementById('conditions');
  const newsContainer = document.getElementById('newsContainer');
  const newsList = document.getElementById('newsList');
  


  

  
  async function initApp() {
    try {
      await getUserLocation();
      await fetchAgriNews();
    } catch (error) {
      console.error('Initialization error:', error);
      handleLocationError(error);
    }
  }

  function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      // Show loading state
      locationEl.textContent = 'Detecting location...';
      
      // Geolocation options
      const options = {
        enableHighAccuracy: true,  // Try to use GPS if available
        timeout: 10000,           // 10 seconds timeout
        maximumAge: 0             // Don't use cached position
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await Promise.all([
              fetchWeatherData(position.coords.latitude, position.coords.longitude),
              reverseGeocode(position.coords.latitude, position.coords.longitude)
            ]);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }

  function handleLocationError(error) {
    console.error('Location error:', error);
    
    // User-friendly error messages
    let errorMessage = 'Location unavailable';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access was denied. Please enable location services.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'The request to get location timed out.';
        break;
      case error.UNKNOWN_ERROR:
        errorMessage = 'An unknown error occurred.';
        break;
    }
    
    locationEl.textContent = errorMessage;
    
    // Fallback to default location (New York)
    fetchWeatherData(40.7128, -74.0060);
  }

  async function fetchWeatherData(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('Weather data not available');
      const data = await response.json();
      updateWeatherUI(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Set default values on error
      humidityEl.textContent = '--%';
      precipitationEl.textContent = '--mm';
      temperatureEl.textContent = '--°C';
      feelsLikeEl.textContent = '--°C';
      windSpeedEl.textContent = '-- m/s';
      conditionsEl.textContent = '--';
    }
  }

  async function reverseGeocode(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.length > 0) {
        locationEl.textContent = `${data[0].name}, ${data[0].country}`;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      locationEl.textContent = 'Location detected (details unavailable)';
    }
  }

  function updateWeatherUI(data) {
    humidityEl.textContent = `${data.main.humidity}%`;
    precipitationEl.textContent = data.rain?.['1h'] ? `${data.rain['1h']}mm` : '0mm';
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
    windSpeedEl.textContent = `${data.wind.speed} m/s`;
    conditionsEl.textContent = data.weather[0].main;
  }

  async function fetchAgriNews() {
    try {
      const response = await fetch('http://localhost:8000/agri-news');
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        newsList.innerHTML = data.map(item => `
          <li>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-chevron-right"></i> ${item.title}
            </a>
          </li>
        `).join('');
      }
    } catch (error) {
      console.error('News fetch error:', error);
    }
  }

  function toggleNews() {
    newsContainer.classList.toggle('hidden');
  }
});



// -------------------------------------------------------------------------------------------
// -----------------------------CSS ELEMENTES JS----------------------------------------------
// -------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const suggestionBtn = document.getElementById('suggestionBtn');
  const pageTransition = document.getElementById('pageTransition');
  const actionButtons = document.querySelectorAll('.action-btn');

  // Button hover animations
  function setupButtonHover(button) {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });
  }

  // Apply hover animations to action buttons
  actionButtons.forEach(button => {
    setupButtonHover(button);
  });

  // Page transition function
  function navigateWithTransition(url, event) {
    event.preventDefault();
    pageTransition.style.opacity = '1';
    pageTransition.style.pointerEvents = 'auto';
    
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }

  // Button click handlers with transitions
  actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const url = this.getAttribute('href');
      this.classList.add('pulse');
      navigateWithTransition(url, e);
    });
  });

  // Draggable suggestion button
  let isDragging = false;
  let offsetX, offsetY;

  suggestionBtn.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - this.getBoundingClientRect().left;
    offsetY = e.clientY - this.getBoundingClientRect().top;
    this.style.transition = 'none';
    this.style.transform = 'scale(0.95)';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    const btn = suggestionBtn;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', function() {
    if (!isDragging) return;
    
    isDragging = false;
    suggestionBtn.style.transition = 'all 0.3s ease';
    suggestionBtn.style.transform = 'scale(1)';
    
    // Check if button is near edges and adjust position
    const btnRect = suggestionBtn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (btnRect.left < 20) {
      suggestionBtn.style.left = '20px';
    }
    
    if (btnRect.top < 20) {
      suggestionBtn.style.top = '20px';
    }
    
    if (btnRect.right > viewportWidth - 20) {
      suggestionBtn.style.left = 'auto';
      suggestionBtn.style.right = '20px';
    }
    
    if (btnRect.bottom > viewportHeight - 20) {
      suggestionBtn.style.top = 'auto';
      suggestionBtn.style.bottom = '20px';
    }
  });

  // Touch support for draggable button
  suggestionBtn.addEventListener('touchstart', function(e) {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - this.getBoundingClientRect().left;
    offsetY = touch.clientY - this.getBoundingClientRect().top;
    this.style.transition = 'none';
    this.style.transform = 'scale(0.95)';
    e.preventDefault();
  });

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    
    const btn = suggestionBtn;
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    e.preventDefault();
  });

  document.addEventListener('touchend', function() {
    if (!isDragging) return;
    
    isDragging = false;
    suggestionBtn.style.transition = 'all 0.3s ease';
    suggestionBtn.style.transform = 'scale(1)';
    
    // Check if button is near edges and adjust position
    const btnRect = suggestionBtn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (btnRect.left < 20) {
      suggestionBtn.style.left = '20px';
    }
    
    if (btnRect.top < 20) {
      suggestionBtn.style.top = '20px';
    }
    
    if (btnRect.right > viewportWidth - 20) {
      suggestionBtn.style.left = 'auto';
      suggestionBtn.style.right = '20px';
    }
    
    if (btnRect.bottom > viewportHeight - 20) {
      suggestionBtn.style.top = 'auto';
      suggestionBtn.style.bottom = '20px';
    }
  });

  // Add animation to feature cards on scroll
  const featureCards = document.querySelectorAll('.feature-card');
  
  function checkScroll() {
    featureCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (cardTop < windowHeight * 0.75) {
        card.style.animation = 'float 3s ease-in-out infinite';
      }
    });
  }
  
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check
});