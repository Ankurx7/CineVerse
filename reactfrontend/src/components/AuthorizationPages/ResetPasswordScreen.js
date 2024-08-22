import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { IoMdHome } from 'react-icons/io';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const search = useLocation().search;
  const token = search.split("=")[1];

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/auth/resetpassword?resetPasswordToken=${token}`,
        {
          password,
        }
      );

      setSuccess(data.message);

    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg max-w-4xl w-11/12">
        {/* Left side with welcome text */}
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-100 rounded-l-lg items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">Welcome Back!</h2>
            <p className="text-lg text-gray-700">
              Reset your password to continue accessing your account. We're here to help you get back on track!
            </p>
          </div>
        </div>

        {/* Right side with reset password form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center">
          <Link to="/" className="absolute top-4 left-4 flex items-center text-gray-600 text-xl">
            <IoMdHome className="mr-2" /> Home
          </Link>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">Reset Your Password</h3>

          {error && (
            <div className="bg-red-500 text-white text-center p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white text-center p-3 rounded-lg mb-4">
              {success} <Link to="/login" className="font-bold text-gray-900">Login</Link>
            </div>
          )}

          <form onSubmit={resetPasswordHandler} className="w-full max-w-md space-y-6">
            <div className="relative">
              <input
                type="password"
                required
                id="password"
                placeholder="New Password"
                autoComplete="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <label
                htmlFor="password"
                className="absolute top-1 left-3 text-sm text-gray-600"
              >
                New Password
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                id="confirmpassword"
                placeholder="Confirm New Password"
                autoComplete="true"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <label
                htmlFor="confirmpassword"
                className="absolute top-1 left-3 text-sm text-gray-600"
              >
                Confirm New Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
