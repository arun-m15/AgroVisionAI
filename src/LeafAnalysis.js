import React, { useState, useRef } from 'react';
import ProfilePage from './ProfilePage';
import './LeafAnalysis.css';

function LeafAnalysis() {
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Mock analysis data - replace with actual API call
  const mockAnalysis = {
    disease: "Early Blight",
    confidence: "92%",
    description: "A fungal disease affecting tomatoes, potatoes, and other crops.",
    suggestions: [
      "Remove infected leaves immediately",
      "Apply copper-based fungicides every 7-10 days",
      "Improve air circulation around plants"
    ],
    fertilizers: [
      { type: "Urea (46% Nitrogen)", schedule: "Apply every 2-3 weeks for rapid growth" },
      { type: "Compost", schedule: "Apply monthly to improve soil organic matter" },
      { type: "Fish Emulsion", schedule: "Apply every 3 weeks for balanced nutrients" }
    ],
    pesticides: [
      { name: "Chlorothalonil", application: "Apply in the evening to avoid plant stress" },
      { name: "Neem Oil", application: "Apply weekly for fungal control and insect repellent" },
      { name: "Mancozeb", application: "Rotate every 7 days with other fungicides" }
    ],
    harvestRecommendation: "Harvest 7-10 days after last treatment, check for complete disease clearance"
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        analyzeImage(); // Auto-trigger analysis when image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsLoading(false);
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const downloadReport = () => {
    const report = `
      🌿 **Leaf Disease Report** 🌿

      **Disease Detected**: ${analysis.disease} (Confidence: ${analysis.confidence})

      **Immediate Actions**:
      - ${analysis.suggestions.join('\n    - ')}

      **Recommended Fertilizers**:
      - ${analysis.fertilizers.map(f => `${f.type} - Apply: ${f.schedule}`).join('\n    - ')}

      **Recommended Pesticides**:
      - ${analysis.pesticides.map(p => `${p.name} - Apply: ${p.application}`).join('\n    - ')}

      **Harvest Recommendation**:
      - ${analysis.harvestRecommendation}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leaf-analysis-report.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="leaf-analysis-container">
      <ProfilePage />
      
      <main className="analysis-main">
        <h1 className="page-title">Leaf Disease Analysis</h1>
        
        <div className="analysis-content">
          {/* Left Side - Image Upload */}
          <div className="upload-section">
            <div 
              className="upload-area"
              onClick={triggerFileInput}
            >
              {preview ? (
                <img src={preview} alt="Uploaded leaf" className="leaf-preview" />
              ) : (
                <div className="upload-instructions">
                  <div className="upload-icon">📷</div>
                  <p>Click to upload or scan leaf image</p>
                  <p className="subtext">Supports JPG, PNG (max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            
            <div className="scan-options">
              <button className="scan-button" onClick={triggerFileInput}>
                Upload Image
              </button>
              <button className="scan-button">
                Open Camera
              </button>
            </div>
            
            {isLoading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Analyzing leaf image...</p>
              </div>
            )}
          </div>
          
          {/* Right Side - Analysis Results */}
          <div className="results-section">
            {analysis ? (
              <>
                <div className="disease-card">
                  <h2>Disease Detected</h2>
                  <div className="disease-header">
                    <span className="disease-name">{analysis.disease}</span>
                    <span className="confidence-badge">{analysis.confidence} confidence</span>
                  </div>
                  <p className="disease-description">{analysis.description}</p>
                </div>
                
                <div className="recommendation-card">
                  <h3>Immediate Actions</h3>
                  <ul className="recommendation-list">
                    {analysis.suggestions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="fertilizer-card">
                  <h3>Optimized Fertilizers</h3>
                  <div className="fertilizer-details">
                    {analysis.fertilizers.map((fertilizer, index) => (
                      <div key={index}>
                        <span className="fertilizer-type">{fertilizer.type}</span>
                        <span className="fertilizer-schedule">{fertilizer.schedule}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pesticide-card">
                  <h3>Recommended Pesticides</h3>
                  <ul className="pesticide-list">
                    {analysis.pesticides.map((pesticide, index) => (
                      <li key={index}>
                        <span className="pesticide-name">{pesticide.name}</span>
                        <span className="pesticide-application">{pesticide.application}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="harvest-card">
                  <h3>Harvest Recommendation</h3>
                  <p className="harvest-text">{analysis.harvestRecommendation}</p>
                </div>

                {/* Download Report Button */}
                <button className="download-report-button" onClick={downloadReport}>
                  Download Report
                </button>
              </>
            ) : preview ? (
              <div className="empty-state">
                <div className="microscope-icon">🔍</div>
                <p>Analysis in progress...</p>
              </div>
            ) : (
              <div className="empty-state">
                <div className="leaf-icon">🍃</div>
                <p>Upload a leaf image to begin analysis</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LeafAnalysis;
