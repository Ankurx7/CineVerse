import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoMdHome } from 'react-icons/io';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      // Use the full URL if needed based on your setup
      const { data } = await axios.post("https://cine-verse-b2b3dhvb0-ankur-akashs-projects.vercel.app/auth/login", { email, password });
      
      // Ensure that data.token exists
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        navigate("/");
      } else {
        throw new Error("No token received from server.");
      }
    } catch (error) {
      console.error(error); // Log error to check structure
      setError(error.response?.data?.error || "An error occurred");
      setTimeout(() => {
        setError("");
      }, 4500);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
      <div className="flex lg:w-[80%] max-w-[1200px] bg-white rounded-lg shadow-lg">
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
          <Link to="/" className="absolute top-4 left-4 flex items-center text-gray-600 text-xl">
            <IoMdHome className="mr-2" /> Home
          </Link>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">Log In</h2>
            <p className="text-gray-600 text-sm mt-2">
              Please enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={loginHandler} className="space-y-6">
            {error && (
              <div className="bg-red-600 text-white text-center py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                required
                id="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <label
                htmlFor="email"
                className="absolute top-1 left-3 text-sm text-gray-600"
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <label
                htmlFor="password"
                className="absolute top-1 left-3 text-sm text-gray-600"
              >
                Password
              </label>
            </div>

            <Link
              to="/forgotpassword"
              className="block text-right text-indigo-600 font-semibold text-sm"
            >
              Forgot Password?
            </Link>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600 text-sm">
              Don't have an account? 
              <Link to="/register" className="text-indigo-600 font-semibold">
                Sign Up
              </Link>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center w-1/2 bg-indigo-100 rounded-r-lg">
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Welcome Back!</h2>
            <p className="text-indigo-600 text-lg">We're glad to see you again. Please log in to continue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
