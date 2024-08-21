import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import CardStory from "../components/Pages/CardStory";
import NoStories from "../components/Pages/NoStories";

const Home = () => {
  const search = useLocation().search;
  const safeStories = Array.isArray(stories) ? stories : [];
  const searchKey = new URLSearchParams(search).get('search');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(true); // Use state to track mounting

  useEffect(() => {
    const fetchStories = async () => {
      const controller = new AbortController();
      const { signal } = controller;

      setLoading(true);
      try {
        const { data } = await axios.get(`/story/getAllStories`, {
          params: { search: searchKey || "" },
          signal
        });

        if (isMounted) {
          navigate({
            pathname: '/',
            search: `?search=${searchKey || ""}`
          });

          setStories(Array.isArray(data.data) ? data.data : []);
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
      setIsMounted(false);
      controller.abort();
    };
  }, [searchKey, navigate, isMounted]);

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
      {safeStories.length > 0 ? (
        safeStories.map(story => (
          <CardStory key={uuidv4()} story={story} />
        ))
      ) : (
        <NoStories />
      )}
    </div>
);

export default Home;
