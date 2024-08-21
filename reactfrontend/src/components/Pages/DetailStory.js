import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loader from '../../CommonPages/Loader';
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs';
import CommentSidebar from './CommentAddOn';

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeUser, setActiveUser] = useState(null);
  const [story, setStory] = useState(null);
  const [storyLikeUser, setStoryLikeUser] = useState([]);
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const slug = useParams().slug;
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getDetailStory = async () => {
      setLoading(true);
      let activeUser = null;

      try {
        // Fetch active user info if authenticated
        const authResponse = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          signal: controller.signal,
        });
        activeUser = authResponse.data.user;
        if (isMounted) setActiveUser(activeUser);
      } catch (error) {
        console.error("Error fetching active user:", error);
        if (isMounted) setActiveUser(null);
      }

      if (!activeUser) {
        setLoading(false);
        navigate('/login-prompt');
        return;
      }

      try {
        const { data } = await axios.post(`/story/${slug}`, { activeUser }, {
          signal: controller.signal,
        });
        if (isMounted) {
          setStory(data.data);
          setLikeStatus(data.likeStatus);
          setLikeCount(data.data?.likeCount || 0);
          setStoryLikeUser(data.data?.likes || []);

          const story_id = data.data?._id;
          if (activeUser?.readList && activeUser.readList.includes(story_id)) {
            setStoryReadListStatus(true);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching story details:", error);
        if (isMounted) {
          setStory(null);
          navigate("/not-found");
        }
      }
    };

    getDetailStory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, navigate]);

  const handleLike = async () => {
    setLikeStatus(!likeStatus);

    try {
      const { data } = await axios.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setLikeCount(data.data?.likeCount || 0);
      setStoryLikeUser(data.data?.likes || []);
    } catch (error) {
      console.error("Error handling like:", error);
      setStory(null);
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this post?")) {
      try {
        await axios.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        navigate("/");
      } catch (error) {
        console.error("Error deleting story:", error);
      }
    }
  };

  const editDate = (createdAt) => {
    if (!createdAt) return '';
    const d = new Date(createdAt);
    return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`;
  };

  const addStoryToReadList = async () => {
    try {
      const { data } = await axios.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setStoryReadListStatus(data.status);
      const readListLength = document.getElementById("readListLength");
      if (readListLength) readListLength.textContent = data.user.readListLength;
    } catch (error) {
      console.error("Error adding story to read list:", error);
    }
  };

  if (loading) return <Loader />;

  if (!story) return <p>Story not found.</p>;

  // Check if the current user is the author of the story
  const isAuthor = activeUser && story.author && story.author._id === activeUser._id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/" className="text-gray-600 hover:text-gray-800 flex items-center">
          <FiArrowLeft className="mr-2" />
          Go back
        </Link>
        <h5 className="text-xl font-semibold">{story.title}</h5>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <ul className="flex items-center space-x-4">
          {story.author && (
            <li className="flex items-center space-x-2">
              <img className="w-10 h-10 rounded-full" src={`/userPhotos/${story.author.photo}`} alt={story.author.username} />
              <span className="font-medium">{story.author.username}</span>
            </li>
          )}
          <li className="text-gray-500">{editDate(story.createdAt)}</li>
          <li className="text-gray-500">-</li>
          <li className="text-gray-500">{story.readtime} min read</li>
        </ul>

        {!activeUser?.username && (
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-600 flex items-center"
              onClick={() => setSidebarShowStatus(!sidebarShowStatus)}
            >
              <FaRegComment className="text-xl" />
              <span className="ml-1">{story.commentCount}</span>
            </button>
          </div>
        )}

        {isAuthor && (
          <div className="flex items-center space-x-4">
            <Link to={`/story/${story.slug}/edit`} className="text-blue-600 hover:text-blue-800">
              <FiEdit />
            </Link>
            <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
              <RiDeleteBin6Line />
            </button>
          </div>
        )}
      </div>

      <CommentSidebar
        slug={slug}
        sidebarShowStatus={sidebarShowStatus}
        setSidebarShowStatus={setSidebarShowStatus}
        activeUser={activeUser}
      />

      <div className="mb-6">
        <img className="w-full h-96 object-cover rounded-md" src={`/storyImages/${story.image}`} alt={story.title} />
      </div>

      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: story.content }}></div>

      {activeUser?.username && (
        <div className="fixed bottom-4 right-4 space-y-4">
          <div className="flex items-center space-x-4">
            <button className="cursor-pointer" onClick={handleLike}>
              {likeStatus ? <FaHeart color="#0063a5" /> : <FaRegHeart />}
            </button>
            <span className={`font-semibold ${likeStatus ? "text-blue-600" : "text-gray-500"}`}>{likeCount}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="cursor-pointer flex items-center"
              onClick={() => setSidebarShowStatus(!sidebarShowStatus)}
            >
              <FaRegComment className="text-xl" />
              <span className="ml-1">{story.commentCount}</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="cursor-pointer" onClick={addStoryToReadList}>
              {storyReadListStatus ? <BsBookmarkFill color="#0205b1" /> : <BsBookmarkPlus />}
            </button>
          </div>

          {isAuthor && (
            <div className="relative">
              <button className="cursor-pointer">
                <BsThreeDots />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 text-gray-700">
                <Link to={`/story/${story.slug}/edit`} className="block py-2 px-4 hover:bg-gray-100">Edit Story</Link>
                <button onClick={handleDelete} className="block w-full text-left py-2 px-4 hover:bg-gray-100">Delete Story</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailStory;
