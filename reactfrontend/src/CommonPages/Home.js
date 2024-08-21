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
    let isMounted = true; // Flag to check if the component is still mounted
    const controller = new AbortController(); // Create an AbortController
    const { signal } = controller; // Extract the signal

    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/story/getAllStories`, {
          params: { search: searchKey || "" },
          signal // Pass the signal to axios
        });

        if (isMounted) { // Only update state if the component is still mounted
          navigate({
            pathname: '/',
            search: `?search=${searchKey || ""}`
          });

          setStories(data.data || []); // Ensure that stories is always an array
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching stories:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStories();

    return () => {
      isMounted = false; // Set the flag to false on component unmount
      controller.abort(); // Cleanup the request on component unmount
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

const StoryList = ({ stories }) => {
  const safeStories = Array.isArray(stories) ? stories : []; // Ensure stories is always an array

  return (
    <div className="flex flex-col gap-6 justify-center relative">
      {safeStories.length > 0 ? (
        safeStories.map(story => (
          <CardStory key={uuidv4()} story={story} />
        ))
      ) : (
        <NoStories />
      )}
    </div>
  );
};

export default Home;
