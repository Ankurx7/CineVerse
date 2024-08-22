import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { MdOutlineWavingHand, MdWavingHand } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CommentItem = ({ comment, activeUser }) => {
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(comment.likeCount);
    const [likeStatus, setLikeStatus] = useState(false);

    useEffect(() => {
        const getCommentLikeStatus = async () => {
            const comment_id = comment._id;
            try {
                const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/comment/${comment_id}/getCommentLikeStatus`, { activeUser }, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setLikeStatus(data.likeStatus);
            } catch (error) {
                localStorage.removeItem("authToken");
                navigate("/");
            }
        };

        getCommentLikeStatus();
    }, [comment._id, activeUser, navigate]);

    const editDate = (createdAt) => {
        const d = new Date(createdAt);
        const datestring = `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`;
        return datestring;
    };

    const handleCommentLike = async () => {
        const comment_id = comment._id;
        try {
            const { data } = await axios.post(`/comment/${comment_id}/like`, { activeUser }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setLikeCount(data.data.likeCount);
            setLikeStatus(data.likeStatus);
        } catch (error) {
            localStorage.removeItem("authToken");
            navigate("/");
        }
    };

    return (
        <div className="p-4 mb-4 bg-white shadow-md rounded">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <img
                        src={`/userPhotos/${comment.author.photo}`}
                        alt={comment.author.username}
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                        <div className="font-semibold text-gray-800">{comment.author.username}</div>
                        <div className="text-sm text-gray-600">{editDate(comment.createdAt)}</div>
                    </div>
                </div>
                {activeUser.username === comment.author.username && (
                    <BsThreeDots className="text-gray-600 cursor-pointer" />
                )}
            </div>
            <p className="text-gray-800 mb-2">{comment.content}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleCommentLike}>
                    {likeStatus ? <MdWavingHand className="text-yellow-500" /> : <MdOutlineWavingHand className="text-gray-500" />}
                    <span className="text-gray-800">{likeCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                    {[...Array(comment.star)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
