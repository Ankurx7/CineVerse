import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../CommonPages/Loader';
import { AuthContext } from '../../ReactContext/UserData';
import { FiArrowLeft } from 'react-icons/fi';

const Profile = () => {
    const { config } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserProfile = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get("/user/profile", config);
                setUser(data.data);
                setLoading(false);
            } catch (error) {
                navigate('/');
            }
        };
        getUserProfile();
    }, [config, navigate]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="flex flex-col items-center max-w-3xl mx-auto my-12 p-6 bg-white shadow-lg rounded-lg">
                    <Link to="/" className="text-blue-500 text-xl mb-4 inline-flex items-center">
                        <FiArrowLeft className="mr-2" /> Back to Home
                    </Link>
                    
                    <div className="flex flex-col items-center w-full bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                            <img src={`/userPhotos/${user.photo}`} alt={user.username} className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.username}</h2>
                        <p className="text-gray-600 mb-6">{user.email}</p>

                        <div className="flex space-x-4 w-full mt-6">
                            <Link to="/edit_profile" className="flex-1 bg-blue-600 text-white rounded-md py-2 text-center font-medium hover:bg-blue-700 transition">
                                Edit Profile
                            </Link>
                            <Link to="/change_password" className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2 text-center font-medium hover:bg-gray-300 transition">
                                Change Password
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
