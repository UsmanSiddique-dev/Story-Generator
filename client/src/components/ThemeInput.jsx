import { useState } from "react";

export default function ThemeInput({ onsubmit }) {
  const [theme, setTheme] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!theme.trim()) {
      setError("Please enter a theme name");
      return;
    }
    onsubmit(theme);
  };
  return (
    <div className="theme-input-container">
      <h2>Generate Your Adventure</h2>
      <p>Enter a theme for your interactive story</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Enter a Theme"
            className={error ? "error" : ""}
          />
          {error && <span className="error-text">{error}</span>}
        </div>
        <button type="submit" className="generate-btn">
          Generate Story
        </button>
      </form>
    </div>
  );
}
