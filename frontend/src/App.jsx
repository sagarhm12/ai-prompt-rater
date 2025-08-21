import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(""); // Reset error

    try {
      const res = await fetch("http://localhost:5000/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        // If response is not ok, extract error message
        const err = await res.json();
        setError(err.error || "Unknown error occurred.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Network error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 32, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2>AI Prompt Rater</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          style={{ width: "100%", padding: 8, marginBottom: 16 }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
        />
        <button type="submit" disabled={loading} style={{ padding: "8px 24px" }}>
          {loading ? "Rating..." : "Rate Prompt"}
        </button>
      </form>
      {error && (
        <div style={{ marginTop: 16, color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && (
        <div style={{ marginTop: 32 }}>
          <strong>Score:</strong> {result.score}<br />
          <strong>Feedback:</strong> {result.feedback}<br />
          <strong>Improved Prompt:</strong>
          <div style={{ marginTop: 8, background: "#f4f4f4", padding: 12, borderRadius: 4 }}>{result.improved}</div>
        </div>
      )}
    </div>
  );
}

export default App;