import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import CardStory from "../components/Pages/CardStory";
import NoStories from "../components/Pages/NoStories";

const Home = () => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get('search');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      const controller = new AbortController(); // Create an AbortController
      const { signal } = controller; // Extract the signal

      setLoading(true);
      try {
        const { data } = await axios.get(`/story/getAllStories`, {
          params: { search: searchKey || "" },
          signal // Pass the signal to axios
        });

        if (data?.data) { // Check if data is defined and has a data property
          setStories(data.data);
          navigate({
            pathname: '/',
            search: `?search=${searchKey || ""}`
          });
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }

      return () => {
        controller.abort(); // Cleanup the request on component unmount
      };
    };

    fetchStories();

    // Set the flag to false on component unmount
    return () => {
      controller.abort(); // Abort the fetch request if the component unmounts
    };
  }, [searchKey, navigate]);

  return (
    <div className="relative p-4 bg-gradient-to-r from-blue-200 to-teal-200 min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <StoryList stories={stories} />
      )}
    </div>
  );
};

const StoryList = ({ stories }) => (
  <div className="flex flex-col gap-6 justify-center relative">
    {stories.length > 0 ? (
      stories.map(story => (
        <CardStory key={story.id || uuidv4()} story={story} /> // Use a stable key if possible
      ))
    ) : (
      <NoStories />
    )}
  </div>
);

export default Home;
