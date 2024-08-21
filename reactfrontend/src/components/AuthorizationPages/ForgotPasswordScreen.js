import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io';
import { FaHome } from 'react-icons/fa';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/auth/forgotpassword", { email });
      setSuccess(data.message);
    } catch (error) {
      setError(error.response.data.error);
      setEmail("");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-300 via-pink-300 to-red-300">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md relative">
        <Link to="/" className="absolute top-4 left-4 flex items-center text-gray-600 text-xl">
          <IoMdArrowBack className="mr-2" /> Back
        </Link>
        <Link to="/" className="absolute top-4 right-4 flex items-center text-gray-600 text-xl">
          <FaHome className="mr-2" /> Home
        </Link>
        <form onSubmit={forgotPasswordHandler} className="space-y-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Reset Your Password</h3>
            <p className="text-lg text-gray-700">
              Enter the email associated with your account. We will send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="bg-red-500 text-white text-center p-4 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white text-center p-4 rounded-lg flex flex-col items-center">
              {success}
              <Link to="/" className="mt-4 text-white font-semibold underline">
                Return to Home
              </Link>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              required
              id="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <label
              htmlFor="email"
              className="absolute top-[-0.5rem] left-4 bg-white text-sm text-gray-600 px-1"
            >
              Email Address
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
