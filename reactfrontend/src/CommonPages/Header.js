import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import SearchForm from './ClientSearch';
import { RiPencilFill } from 'react-icons/ri';
import { BiLogOut } from 'react-icons/bi';
import { AuthContext } from '../ReactContext/UserData';

const Header = () => {
    const { activeUser } = useContext(AuthContext);
    const [auth, setAuth] = useState(Boolean(localStorage.getItem("authToken")));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // This effect sets auth state based on localStorage token and handles loading state
        setAuth(Boolean(localStorage.getItem("authToken")));

        // Simulate loading state
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1600);

        // Cleanup function
        return () => clearTimeout(timer);

    }, []); // Empty dependency array means this effect runs once on mount

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setAuth(false); // Update auth state immediately
        navigate('/');
    };

    return (
        <header className="w-full bg-gray-900 text-white py-2">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-md ">
                    <SearchForm className="w-full" />
                </div>

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 mx-4 ">
                    CineVerse
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-2">
                    {auth ? (
                        <div className="flex items-center space-x-2">
                            {/* Profile Picture and Username */}
                            <Link to="/profile" className="flex items-center space-x-2">
                                <img 
                                    src={activeUser?.profilePicture ? activeUser.profilePicture : '/default-profile.png'} 
                                    alt="Profile" 
                                    className="w-8 h-8 rounded-full border border-white" 
                                />
                                <span className="hidden md:inline">{activeUser?.username || 'User'}</span>
                            </Link>
                            {/* Logout Button */}
                            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded flex items-center space-x-1">
                                <BiLogOut />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                            {/* Add Story Button */}
                            <Link to="/addstory" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded flex items-center space-x-1">
                                <RiPencilFill />
                                <span className="hidden md:inline">Add Story</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded">Sign Up</Link>
                            <Link to="/forgotpassword" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded">Forgot Password</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
