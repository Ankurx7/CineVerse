import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdHome } from 'react-icons/io';
import { Link } from "react-router-dom";
const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 8000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axios.post("/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("authToken", data.token);

      setTimeout(() => {
        navigate('/');
      }, 1800);

    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
      <div className="flex lg:w-[80%] max-w-[1200px] bg-white rounded-lg shadow-lg">
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <Link to="/" className="absolute top-4 left-4 flex items-center text-gray-600 text-xl">
            <IoMdHome className="mr-2" /> Home
          </Link>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">Create Your Account</h2>
            <p className="text-gray-600 text-sm mt-2">
              Join us to start posting and connecting with others. It's free!
            </p>
          </div>

          <form onSubmit={registerHandler} className="space-y-6">
            {error && (
              <div className="bg-red-600 text-white text-center py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                required
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <label
                htmlFor="username"
                className="absolute top-1 left-3 text-sm text-gray-600"
              >
                Username
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                required
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <label
                htmlFor="password"
                className="absolute top-1 left-3 text-sm text-gray-600"
              >
                Password
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                id="confirmpassword"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <label
                htmlFor="confirmpassword"
                className="absolute top-1 left-3 text-sm text-gray-600"
              >
                Confirm Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600 text-sm">
              Already have an account? 
              <Link to="/login" className="text-indigo-600 font-semibold">
                Sign In
              </Link>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center w-1/2 bg-indigo-100 rounded-r-lg">
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Welcome to CineVerse !</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
