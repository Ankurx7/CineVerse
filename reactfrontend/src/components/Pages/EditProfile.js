import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineUpload } from 'react-icons/ai';
import Loader from '../../CommonPages/Loader';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../ReactContext/UserData';
import SuccessDialog from './successDialog'; // Adjust path as needed

const EditProfile = () => {
    const { activeUser, config } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState(null);
    const [previousPhoto, setPreviousPhoto] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (photo) formData.append('photo', photo);

        try {
            await axios.post('${process.env.REACT_APP_API_BASE_URL}/user/editProfile', formData, config);
            setSuccess(true);
            setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            setError(error.response?.data?.error || 'An error occurred');
            setTimeout(() => setError(''), 7000);
        }
    };

    useEffect(() => {
        setUsername(activeUser.username);
        setEmail(activeUser.email);
        setPreviousPhoto(activeUser.photo);
        setLoading(false);
    }, [activeUser]);

    const handleCloseDialog = () => {
        setSuccess(false);
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                    <div className="w-full max-w-lg bg-white shadow-md rounded-lg overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="bg-red-500 text-white text-center rounded-lg py-2 mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                    {photo ? (
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-4xl text-gray-600" />
                                    )}
                                </div>
                                <label className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center space-x-2">
                                    <AiOutlineUpload />
                                    <span>Change Photo</span>
                                    <input
                                        type="file"
                                        className="sr-only"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </label>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Username"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {success && (
                <SuccessDialog
                    message="Your profile has been successfully updated!"
                    onClose={handleCloseDialog}
                />
            )}
        </>
    );
};

export default EditProfile;
