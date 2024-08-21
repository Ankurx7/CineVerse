import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const ChangePassword = () => {
    const [isRevealPass1, setIsRevealPass1] = useState(false);
    const [isRevealPass2, setIsRevealPass2] = useState(false);
    const [isRevealPass3, setIsRevealPass3] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords don't match");
        }

        try {
            const { data } = await axios.put(
                "/user/changePassword",
                { newPassword, oldPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            setSuccess(data.message);
            setTimeout(() => {
                setSuccess("");
            }, 5800);
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5800);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
            >
                {error && <div className="bg-red-500 text-white text-center p-2 mb-4 rounded">{error}</div>}
                {success && (
                    <div className="bg-green-500 text-white text-center p-2 mb-4 rounded">
                        {success}
                        <Link to="/profile" className="font-bold ml-2 text-black">Go Profile</Link>
                    </div>
                )}

                <div className="relative mb-6">
                    <input
                        type={isRevealPass1 ? "text" : "password"}
                        autoComplete="off"
                        id="old_password"
                        placeholder="Old Password"
                        name="old_password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <i
                        onClick={() => setIsRevealPass1(!isRevealPass1)}
                        className="absolute top-3 right-4 text-gray-500 cursor-pointer"
                    >
                        {isRevealPass1 ? <IoEyeOffOutline size={24} /> : <IoEyeOutline size={24} />}
                    </i>
                </div>

                <div className="relative mb-6">
                    <input
                        type={isRevealPass2 ? "text" : "password"}
                        id="new_password"
                        autoComplete="off"
                        placeholder="New Password"
                        name="new_password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <i
                        onClick={() => setIsRevealPass2(!isRevealPass2)}
                        className="absolute top-3 right-4 text-gray-500 cursor-pointer"
                    >
                        {isRevealPass2 ? <IoEyeOffOutline size={24} /> : <IoEyeOutline size={24} />}
                    </i>
                </div>

                <div className="relative mb-6">
                    <input
                        type={isRevealPass3 ? "text" : "password"}
                        id="confirm_password"
                        autoComplete="off"
                        placeholder="Confirm Password"
                        name="confirm_password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <i
                        onClick={() => setIsRevealPass3(!isRevealPass3)}
                        className="absolute top-3 right-4 text-gray-500 cursor-pointer"
                    >
                        {isRevealPass3 ? <IoEyeOffOutline size={24} /> : <IoEyeOutline size={24} />}
                    </i>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
