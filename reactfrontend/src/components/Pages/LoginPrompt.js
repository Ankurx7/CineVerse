import React from 'react';
import { Link } from 'react-router-dom';

const LoginPrompt = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">You need to be logged in to view this article</h1>
      <p className="text-gray-600 mb-6">Please log in or sign up to access the content.</p>
      <div className="space-y-4">
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Login
        </Link>
        <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginPrompt;
