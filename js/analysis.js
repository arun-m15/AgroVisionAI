// Configuration - IMPORTANT: In production, use a backend service instead of exposing API key
const API_KEY = 'AIzaSyBW3wpHQD-KLrKn9xrcN2tSmCZuRQ1uEI4'; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('analysisForm');
  const fileInput = document.getElementById('leafImage');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const imagePreview = document.getElementById('imagePreview');
  const resultsDiv = document.getElementById('results');
  const loadingIndicator = document.getElementById('loadingIndicator');
  
  // Preview uploaded image
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        resultsDiv.innerHTML = '';
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    analyzeBtn.disabled = true;
    
    const file = fileInput.files[0];
    if (!file) {
      showError('Please select an image file first.');
      analyzeBtn.disabled = false;
      return;
    }

    try {
      loadingIndicator.style.display = 'flex';
      resultsDiv.innerHTML = '';
      
      const imageBase64 = await readFileAsBase64(file);
      const response = await analyzeLeaf(imageBase64);
      
      displayResults(response);
    } catch (error) {
      console.error('Analysis error:', error);
      showError(`Analysis failed: ${error.message}`);
    } finally {
      loadingIndicator.style.display = 'none';
      analyzeBtn.disabled = false;
    }
  });

  async function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  }

  async function analyzeLeaf(imageBase64) {
    const prompt = `You are a plant pathologist. Analyze this leaf image and provide:
    1. Disease identification (or "healthy" if no disease)
    2. Confidence level (High/Medium/Low)
    3. Symptoms description
    4. Treatment recommendations
    5. Prevention methods
    
    Format your response with clear headings for each section.`;

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Unexpected API response format');
    }

    return data.candidates[0].content.parts[0].text;
  }

  function displayResults(analysisText) {
    const formattedText = formatAnalysisText(analysisText);
    resultsDiv.innerHTML = `
      <div class="disease-result">
        <h3>🌱 Leaf Analysis Results</h3>
        ${formattedText}
        <div class="disclaimer">
          <p><em>Note: This analysis is AI-generated and should be verified by a plant health specialist.</em></p>
        </div>
      </div>
    `;
  }

  function formatAnalysisText(text) {
    // Convert markdown-style formatting to HTML
    return text
      .replace(/## (.*?)\n/g, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/(\d+\.)\s/g, '<br>$1 ');
  }

  function showError(message) {
    resultsDiv.innerHTML = `
      <div class="error">
        <strong>Error:</strong> ${message}
        <p>Please try again or use a different image.</p>
      </div>
    `;
  }
});

//----------css content for animation and scroll down effect----------
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const resultsContainer = document.getElementById('results');
  const downloadReport = document.getElementById('downloadReport');
  const reportActions = document.getElementById('reportActions');

  // Only proceed if elements exist
  if (downloadReport && resultsContainer) {
    // Show report actions when results are available (you'll call this after analysis)
    function showReportActions() {
      reportActions.style.display = 'flex';
      smoothScrollToResults();
    }

    // Smooth scroll to results
    function smoothScrollToResults() {
      resultsContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Download report as HTML file
    downloadReport.addEventListener('click', function() {
      // Get the HTML content of the results
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Leaf Disease Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h2 { color: #2E7D32; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; }
            .result-item { margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Leaf Disease Analysis Report</h1>
          ${resultsContainer.innerHTML}
          <p>Report generated on ${new Date().toLocaleString()}</p>
        </body>
        </html>
      `;
      
      // Create download link
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leaf-disease-report.html';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });

    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    // Example usage after getting analysis results:
    // function displayAnalysisResults(results) {
    //   resultsContainer.innerHTML = formatResults(results);
    //   showReportActions(); // This will show buttons and scroll to results
    // }
  }
});


// --------------------------------------------------------
// ---------------CSS ELEMENTS FOR JS ---------------------
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const uploadOption = document.getElementById('uploadOption');
  const cameraOption = document.getElementById('cameraOption');
  const uploadSection = document.getElementById('uploadSection');
  const cameraSection = document.getElementById('cameraSection');
  const leafImage = document.getElementById('leafImage');
  const cameraFeed = document.getElementById('cameraFeed');
  const captureBtn = document.getElementById('captureBtn');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const analysisForm = document.getElementById('analysisForm');
  const imagePreview = document.getElementById('imagePreview');
  const previewContainer = document.getElementById('previewContainer');
  const resultsContainer = document.getElementById('results');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const plantTransition = document.getElementById('plantTransition');

  // Toggle between upload and camera
  uploadOption.addEventListener('click', () => {
    uploadOption.classList.add('active');
    cameraOption.classList.remove('active');
    uploadSection.style.display = 'block';
    cameraSection.style.display = 'none';
  });

  cameraOption.addEventListener('click', () => {
    cameraOption.classList.add('active');
    uploadOption.classList.remove('active');
    uploadSection.style.display = 'none';
    cameraSection.style.display = 'block';
    startCamera();
  });

  // Handle file upload preview
  leafImage.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(event) {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        previewContainer.querySelector('.preview-placeholder').style.display = 'none';
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Camera functionality
  function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        cameraFeed.srcObject = stream;
        cameraFeed.style.display = 'block';
        document.querySelector('.camera-placeholder').style.display = 'none';
      })
      .catch(err => {
        console.error("Camera error:", err);
        alert("Couldn't access camera. Please check permissions.");
      });
  }

  captureBtn.addEventListener('click', function() {
    const context = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraFeed.videoWidth;
    cameraCanvas.height = cameraFeed.videoHeight;
    context.drawImage(cameraFeed, 0, 0, cameraCanvas.width, cameraCanvas.height);
    
    imagePreview.src = cameraCanvas.toDataURL('image/png');
    imagePreview.style.display = 'block';
    previewContainer.querySelector('.preview-placeholder').style.display = 'none';
    
    // Stop camera
    const stream = cameraFeed.srcObject;
    stream.getTracks().forEach(track => track.stop());
    cameraFeed.style.display = 'none';
    document.querySelector('.camera-placeholder').style.display = 'block';
  });

  // Form submission
  analysisForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!imagePreview.src || imagePreview.style.display === 'none') {
      alert("Please upload or capture an image first");
      return;
    }
    
    // Show loading
    loadingIndicator.style.display = 'flex';
    plantTransition.style.opacity = '1';
    
    // Simulate analysis
    setTimeout(() => {
      loadingIndicator.style.display = 'none';
      plantTransition.style.opacity = '0';
      showResults();
    }, 2500);
  });

  // Show results with auto-scroll
  function showResults() {
    resultsContainer.innerHTML = `
      <div class="result-card">
        <h3><i class="fas fa-diagnoses"></i> Analysis Results</h3>
        <div class="result-item">
          <span class="result-label">Disease:</span>
          <span class="result-value">Leaf Rust</span>
        </div>
        <div class="result-item">
          <span class="result-label">Confidence:</span>
          <span class="result-value">87%</span>
        </div>
        <div class="result-item">
          <span class="result-label">Treatment:</span>
          <span class="result-value">Apply fungicide every 7-10 days</span>
        </div>
        <div class="result-item">
          <span class="result-label">Prevention:</span>
          <ul class="tips-list">
            <li>Remove infected leaves promptly</li>
            <li>Ensure proper air circulation</li>
            <li>Avoid overhead watering</li>
          </ul>
        </div>
      </div>
    `;
    
    // Auto-scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }

  // Home button with transition
  document.querySelector('.home-btn').addEventListener('click', function(e) {
    e.preventDefault();
    plantTransition.style.opacity = '1';
    setTimeout(() => {
      window.location.href = this.getAttribute('href');
    }, 500);
  });
});