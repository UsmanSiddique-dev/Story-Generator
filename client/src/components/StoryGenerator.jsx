import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeInput from "./ThemeInput";
import LoadingStatus from "./LoadingStatus";
import { API_BASE_URL } from "../utils";

function StoryGenerator() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("");
  const [JobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateStory = async (theme) => {
    setLoading(true);
    setError(null);
    setTheme(theme);
    try {
      const response = await axios.post(`${API_BASE_URL}/stories/create`, {
        theme,
      });
      const { job_id, status } = response.data;
      setJobId(job_id);
      setJobStatus(status);

      pollJobStatus(job_id);
    } catch (error) {
      setLoading(false);
      setError(`failed to load story ${error.message}`);
      console.error(error);
    }
  };

  const pollJobStatus = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
      const { status, story_id, error: jobError } = response.data;
      if (status === "completed") {
        fetchStory(story_id);
      } else if (status === "failed" || jobError) {
        setError(jobError || "Failed to generate Story");
        setLoading(false);
      }
      setJobStatus(status);
    } catch (error) {
      if (error.response?.status != 404) {
        setError(`Failed to check story details ${error.message}`);
        setLoading(false);
      }
      setError(error);
    }
  };
  useEffect(() => {
    let pollInterval;
    if (JobId && jobStatus === "processing") {
      pollInterval = setInterval(() => {
        pollJobStatus(JobId);
      }, 5000);
    }
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [JobId, jobStatus]);
  const fetchStory = async (id) => {
    try {
      setLoading(false);
      setJobStatus("completed");
      navigate(`/stories/${id}`);
    } catch (e) {
      setError(`failed to load story ${e.message}`);
      setLoading(false);
    }
  };

  const reset = () => {
    setJobId(null);
    setJobStatus(null);
    setError(null);
    setTheme("");
    setLoading(false);
  };
  return (
    <div className="story-generator">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={reset}> Try Afgain</button>
        </div>
      )}
      {!JobId && !error && !loading && <ThemeInput onsubmit={generateStory} />}
      {loading && <LoadingStatus theme={theme} />}
    </div>
  );
}
export default StoryGenerator;
