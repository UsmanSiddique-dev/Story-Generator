import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LoadingStatus from "./LoadingStatus";
import StoryGame from "./StoryGame";
import { API_BASE_URL } from "../utils";
function StoryLoader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  const loadStory = async (storyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/stories/${storyId}/complete`,
      );
      setStory(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Story not found");
      } else {
        setError("Failed to load story");
      }
    } finally {
      setLoading(false);
    }
  };
  const createNewStory = () => {
    navigate("/");
  };
  useEffect(() => {
    loadStory(id);
  }, [id]);
  if (loading) {
    return <LoadingStatus theme={"story"} />;
  }
  if (error) {
    return (
      <div className="story-loader">
        <div className="error-message">
          <h2>Story not Found</h2>
          <p>{error}</p>
          <button onClick={createNewStory}>Go to Story Generator</button>
        </div>
      </div>
    );
  }
  if (story) {
    return (
      <div className="story-loader">
        {/* <h1>{story.title}</h1>
            <p>{story.content}</p> */}
        <StoryGame story={story} onNewStory={createNewStory} />
      </div>
    );
  }
}

export default StoryLoader;
