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
  const [activeUser, setActiveUser] = useState({});
  const [story, setStory] = useState({});
  const [storyLikeUser, setStoryLikeUser] = useState([]);
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const slug = useParams().slug;
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getDetailStory = async () => {
      setLoading(true);
      let activeUser = {};

      try {
        const { data } = await axios.get("${process.env.REACT_APP_API_BASE_URL}/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user;
        setActiveUser(activeUser);
      } catch (error) {
        setActiveUser({});
      }

      try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/story/${slug}`, { activeUser });
        setStory(data.data);
        setLikeStatus(data.likeStatus);
        setLikeCount(data.data.likeCount);
        setStoryLikeUser(data.data.likes);
        setLoading(false);

        const story_id = data.data._id;
        if (activeUser.readList && activeUser.readList.includes(story_id)) {
          setStoryReadListStatus(true);
        }
      } catch (error) {
        setStory({});
        navigate("/not-found");
      }
    };
    getDetailStory();
  }, [slug, setLoading]);

  const handleLike = async () => {
    setTimeout(() => {
      setLikeStatus(!likeStatus);
    }, 1500);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setLikeCount(data.data.likeCount);
      setStoryLikeUser(data.data.likes);
    } catch (error) {
      setStory({});
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this post?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    const datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate();
    return datestring;
  };

  const addStoryToReadList = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setStoryReadListStatus(data.status);
      document.getElementById("readListLength").textContent = data.user.readListLength;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? <Loader /> :
        <>
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

              <div className="flex items-center space-x-4">
                <i className="cursor-pointer text-gray-600" onClick={() => setSidebarShowStatus(!sidebarShowStatus)}>
                  <FaRegComment />
                </i>
                <b className="text-gray-600">{story.commentCount}</b>
              </div>

              {activeUser && story.author && story.author._id === activeUser._id && (
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

            {activeUser.username && (
              <div className="fixed bottom-4 right-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <i className="cursor-pointer" onClick={handleLike}>
                    {likeStatus ? <FaHeart className="text-blue-600" /> : <FaRegHeart className="text-gray-600" />}
                  </i>
                  <b className={`${likeStatus ? "text-blue-600" : "text-gray-600"}`}>{likeCount}</b>
                </div>

                <div className="flex items-center space-x-4">
                  <i className="cursor-pointer text-gray-600" onClick={() => setSidebarShowStatus(!sidebarShowStatus)}>
                    <FaRegComment />
                  </i>
                  <b className="text-gray-600">{story.commentCount}</b>
                </div>

                <div className="flex items-center space-x-4">
                  <i className="cursor-pointer" onClick={addStoryToReadList}>
                    {storyReadListStatus ? <BsBookmarkFill className="text-blue-700" /> : <BsBookmarkPlus className="text-gray-600" />}
                  </i>
                </div>

                <div className="relative group">
                  <i className="cursor-pointer text-gray-600">
                    <BsThreeDots />
                  </i>
                  {activeUser && story.author._id === activeUser._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 text-gray-700 group-hover:block">
                      <Link to={`/story/${story.slug}/edit`} className="block py-2 px-4 hover:bg-gray-100">Edit Story</Link>
                      <button onClick={handleDelete} className="block w-full text-left py-2 px-4 hover:bg-gray-100">Delete Story</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      }
    </>
  );
};

export default DetailStory;
