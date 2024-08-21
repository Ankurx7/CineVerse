import React, { useState, useRef } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import { BsShieldCheck, BsCheckAll } from 'react-icons/bs';
import { IoAdd } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const AddComment = ({ setSidebarShowStatus, slug, getStoryComments, activeUser, count }) => {
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const [star, setStar] = useState(0);
    const [starCurrentVal, setStarCurrentVal] = useState(0);
    const [content, setContent] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showStatus, setShowStatus] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/comment/${slug}/addComment`, { content, star }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            setSuccess('Add Comment successfully');
            setTimeout(() => {
                setSuccess('');
            }, 2700);

            setTimeout(() => {
                document.querySelector(".commentCount").textContent = count + 1;
            }, 650);

            clearInputs();
            getStoryComments();
        } catch (error) {
            if (error.response.data.error === 'Jwt expired') {
                console.log("token expired ...");
                navigate('/');
            }
            setError(error.response.data.error);
            setTimeout(() => {
                setError('');
            }, 4500);
        }
    };

    const clearInputs = () => {
        setStar(0);
        setStarCurrentVal(0);
        setContent('');
        textareaRef.current.textContent = '';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                    Responses (<span className="text-blue-600">{count}</span>)
                </h3>
                <div className="flex items-center space-x-2">
                    <BsShieldCheck className="text-gray-700" />
                    <IoAdd
                        onClick={() => setSidebarShowStatus(false)}
                        className="text-2xl transform rotate-45 text-gray-700"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                    {error}
                </div>
            )}

            {activeUser.username && (
                <form className="bg-white p-4 rounded shadow-md" onSubmit={handleSubmit}>
                    {success && (
                        <div className="bg-green-100 text-green-700 p-2 rounded mb-4 flex items-center">
                            <BsCheckAll className="mr-2" />
                            {success}
                        </div>
                    )}

                    <div className={showStatus ? 'flex items-center mb-4' : 'hidden'}>
                        <img
                            src={`/userPhotos/${activeUser.photo}`}
                            alt={activeUser.username}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-semibold">{activeUser.username}</span>
                    </div>

                    <div className="relative mb-4">
                        <div
                            ref={textareaRef}
                            contentEditable
                            placeholder="What are your thoughts?"
                            id="comment"
                            name="content"
                            onKeyUp={(e) => setContent(e.target.innerHTML)}
                            onFocus={() => setShowStatus(true)}
                            className="border border-gray-300 rounded p-2 min-h-20 text-gray-800 placeholder-gray-400"
                        />
                    </div>

                    <div className={showStatus ? 'flex justify-between items-center' : 'hidden'}>
                        <StarRating setStar={setStar} setStarCurrentVal={setStarCurrentVal} starCurrentVal={starCurrentVal} />
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                className="bg-transparent text-gray-600 border border-gray-300 rounded px-3 py-1"
                                onClick={() => setShowStatus(!showStatus)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded text-white font-semibold ${content === '' ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                disabled={content === ''}
                            >
                                Respond
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddComment;
