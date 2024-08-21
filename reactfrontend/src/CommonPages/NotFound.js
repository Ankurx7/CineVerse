import React from 'react';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center">
    <div className="text-6xl font-bold mb-4">
      <span className="text-red-500">404</span>
    </div>
    <h1 className="text-3xl md:text-4xl font-semibold mb-4">
      Page Not Found
    </h1>
    <p className="text-lg text-gray-300">
      Sorry, the page you're looking for does not exist.
      <br />
      Please check the URL or go back to the homepage.
    </p>
  </div>
);

export default NotFound;
