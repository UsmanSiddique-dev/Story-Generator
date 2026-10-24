import "./app.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StoryLoader from "./components/StoryLoader";
import StoryGenerator from "./components/StoryGenerator";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Interactive Story Generator</h1>
        </header>
        <main>
          <Routes>
            <Route path="/stories/:id" element={<StoryLoader />} />
            <Route path={"/"} element={<StoryGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
