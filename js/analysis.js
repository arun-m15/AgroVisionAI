const API_KEY = 'AIzaSyBW3wpHQD-KLrKn9xrcN2tSmCZuRQ1uEI4'; // Replace with your actual Gemini API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

document.addEventListener('DOMContentLoaded', () => {
  const uploadOption = document.getElementById('uploadOption');
  const cameraOption = document.getElementById('cameraOption');
  const uploadSection = document.getElementById('uploadSection');
  const cameraSection = document.getElementById('cameraSection');
  const leafImage = document.getElementById('leafImage');
  const cameraFeed = document.getElementById('cameraFeed');
  const captureBtn = document.getElementById('captureBtn');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const imagePreview = document.getElementById('imagePreview');
  const previewContainer = document.getElementById('previewContainer');
  const resultsDiv = document.getElementById('results');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const reportActions = document.getElementById('reportActions');
  const downloadReport = document.getElementById('downloadReport');
  const analysisForm = document.getElementById('analysisForm');
  const plantTransition = document.getElementById('plantTransition');

  // Mode toggle
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

  function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      cameraFeed.srcObject = stream;
      cameraFeed.style.display = 'block';
    }).catch(err => {
      alert("Camera error: " + err.message);
    });
  }

  captureBtn.addEventListener('click', () => {
    const ctx = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraFeed.videoWidth;
    cameraCanvas.height = cameraFeed.videoHeight;
    ctx.drawImage(cameraFeed, 0, 0);
    const dataURL = cameraCanvas.toDataURL('image/png');
    imagePreview.src = dataURL;
    imagePreview.style.display = 'block';
    previewContainer.querySelector('.preview-placeholder').style.display = 'none';
    cameraFeed.srcObject.getTracks().forEach(track => track.stop());
    cameraFeed.style.display = 'none';
  });

  leafImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        previewContainer.querySelector('.preview-placeholder').style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  analysisForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!imagePreview.src || imagePreview.style.display === 'none') {
      alert("Please upload or capture an image first.");
      return;
    }

    loadingIndicator.style.display = 'flex';
    plantTransition.style.opacity = '1';
    resultsDiv.innerHTML = '';
    reportActions.style.display = 'none';

    const imageBase64 = imagePreview.src.split(',')[1];

    try {
      const analysis = await analyzeLeaf(imageBase64);
      displayResults(analysis);
      reportActions.style.display = 'block';
    } catch (err) {
      resultsDiv.innerHTML = `<div class="error">❌ ${err.message}</div>`;
    } finally {
      loadingIndicator.style.display = 'none';
      plantTransition.style.opacity = '0';
    }
  });

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
              mimeType: "image/png",
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

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message || "API Error");
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No result found.";
  }

  function displayResults(text) {
    const html = text
      .replace(/## (.*?)\n/g, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    resultsDiv.innerHTML = `
      <div class="disease-result">
        <h3>🌿 AI Leaf Analysis Result</h3>
        ${html}
        <p><em>Note: This is an AI-generated report. Always consult a plant expert for confirmation.</em></p>
      </div>
    `;
  }

  downloadReport.addEventListener('click', () => {
    const content = `
      <html><head><title>Leaf Report</title></head><body>
      <h1>Leaf Disease Report</h1>
      ${resultsDiv.innerHTML}
      <p>Generated on: ${new Date().toLocaleString()}</p>
      </body></html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leaf-analysis-report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // ✅ Back to Home Button (Top-Left Corner)
  const backHomeBtn = document.createElement('button');
  backHomeBtn.textContent = '← Back to Home';
  backHomeBtn.id = 'backHomeBtn'; // For CSS targeting
  backHomeBtn.addEventListener('click', () => {
    window.location.href = '../html/home.html';
  });
  document.body.appendChild(backHomeBtn);
});
