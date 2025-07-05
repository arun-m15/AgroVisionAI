document.addEventListener('DOMContentLoaded', function () {
  const API_KEY = '0f39ba75669e0f240beb542ef6f34686';

  // DOM Elements for Weather & News
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

      locationEl.textContent = 'Detecting location...';

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await Promise.all([
              fetchWeatherData(position.coords.latitude, position.coords.longitude),
              reverseGeocode(position.coords.latitude, position.coords.longitude),
            ]);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(error),
        options
      );
    });
  }

  function handleLocationError(error) {
    console.error('Location error:', error);
    let errorMessage = 'Location unavailable';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Enable it in your browser.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Request timed out.';
        break;
      default:
        errorMessage = 'Unknown error.';
        break;
    }
    locationEl.textContent = errorMessage;
    fetchWeatherData(40.7128, -74.0060); // Fallback to New York
  }

  async function fetchWeatherData(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('Weather fetch failed.');
      const data = await response.json();
      updateWeatherUI(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
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
      const response = await fetch('/agri-news'); // ✅ Use relative path for deployment
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

  // ----------------------------------------
  // CSS / UI JS Elements
  // ----------------------------------------

  const suggestionBtn = document.getElementById('suggestionBtn');
  const pageTransition = document.getElementById('pageTransition');
  const actionButtons = document.querySelectorAll('.action-btn');

  // Hover effects
  function setupButtonHover(button) {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
      button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });
  }

  actionButtons.forEach(setupButtonHover);

  // Page transition animation
  function navigateWithTransition(url, event) {
    event.preventDefault();
    pageTransition.style.opacity = '1';
    pageTransition.style.pointerEvents = 'auto';
    setTimeout(() => window.location.href = url, 500);
  }

  actionButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const url = this.getAttribute('href');
      this.classList.add('pulse');
      navigateWithTransition(url, e);
    });
  });

  // Draggable suggestion button (mouse)
  let isDragging = false;
  let offsetX, offsetY;

  suggestionBtn.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.clientX - this.getBoundingClientRect().left;
    offsetY = e.clientY - this.getBoundingClientRect().top;
    this.style.transition = 'none';
    this.style.transform = 'scale(0.95)';
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    suggestionBtn.style.left = `${x}px`;
    suggestionBtn.style.top = `${y}px`;
    suggestionBtn.style.right = 'auto';
    suggestionBtn.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    suggestionBtn.style.transition = 'all 0.3s ease';
    suggestionBtn.style.transform = 'scale(1)';
    snapToEdges(suggestionBtn);
  });

  // Touch support
  suggestionBtn.addEventListener('touchstart', function (e) {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - this.getBoundingClientRect().left;
    offsetY = touch.clientY - this.getBoundingClientRect().top;
    this.style.transition = 'none';
    this.style.transform = 'scale(0.95)';
    e.preventDefault();
  });

  document.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    suggestionBtn.style.left = `${x}px`;
    suggestionBtn.style.top = `${y}px`;
    suggestionBtn.style.right = 'auto';
    suggestionBtn.style.bottom = 'auto';
    e.preventDefault();
  });

  document.addEventListener('touchend', function () {
    if (!isDragging) return;
    isDragging = false;
    suggestionBtn.style.transition = 'all 0.3s ease';
    suggestionBtn.style.transform = 'scale(1)';
    snapToEdges(suggestionBtn);
  });

  // Snap to screen edges
  function snapToEdges(button) {
    const rect = button.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (rect.left < 20) button.style.left = '20px';
    if (rect.top < 20) button.style.top = '20px';
    if (rect.right > vw - 20) {
      button.style.left = 'auto';
      button.style.right = '20px';
    }
    if (rect.bottom > vh - 20) {
      button.style.top = 'auto';
      button.style.bottom = '20px';
    }
  }

  // Scroll-triggered feature card animations
  const featureCards = document.querySelectorAll('.feature-card');

  function checkScroll() {
    featureCards.forEach(card => {
      const top = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (top < windowHeight * 0.75) {
        card.style.animation = 'float 3s ease-in-out infinite';
      }
    });
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // Start app
  initApp();
});
