import { useState } from "react";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!file) return alert("Please upload an image");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">

        <div className="left-panel">
          <h1>DermaIntel </h1>
          <p>
            AI-powered skin lesion detection platform
            for intelligent healthcare diagnostics.
          </p>

          <div className="stats">
            <div className="stat-box">
              <h3>95%</h3>
              <p>Accuracy</p>
            </div>

            <div className="stat-box">
              <h3>5</h3>
              <p>Detection Types</p>
            </div>

            <div className="stat-box">
              <h3>24/7</h3>
              <p>Analysis</p>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <h2 className="section-title">Skin Analysis</h2>
          <p className="section-subtitle">
            Upload a skin lesion image for AI-powered diagnosis
          </p>

          <div className="upload-box">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handlePredict}>
              Analyze Image
            </button>
          </div>

          {loading && (
            <p className="loading">Analyzing image...</p>
          )}

          {result && (
            <div className="result">
              <h2>{result.prediction}</h2>
              <p>{result.confidence}% Confidence</p>

              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>

              <p style={{ marginTop: "15px" }}>
                Risk Level: <strong>{result.risk_level}</strong>
              </p>
            </div>
          )}

          <div className="footer">
            AI Diagnostic Platform
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;