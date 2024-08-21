import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-700">
            <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center">
                {/* Company Info */}
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h1 className="text-3xl font-extrabold text-white">CineVerse</h1>
                    <p className="text-gray-400 mt-2">
                        Explore the world of movies and reviews with CineVerse, your ultimate movie guide.
                    </p>
                    <p className="text-gray-400 mt-2">
                        Ranchi ,India
                    </p>
                    <p className="text-gray-400 mt-2">
                        Phone: +91 - 2222222222
                    </p>
                    <p className="text-gray-400 mt-2">
                        Email: --x--x--@cineverse.com
                    </p>
                </div>

                {/* Social Media Icons */}
                <div className="mt-6 md:mt-0 flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                        <FaFacebookF size={22} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                        <FaTwitter size={22} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                        <FaInstagram size={22} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                        <FaLinkedinIn size={22} />
                    </a>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-6xl mx-auto py-4 px-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm">
                    © 2024 CineVerse. All Rights Reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
