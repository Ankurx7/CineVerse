// components/SuccessDialog.js
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessDialog = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                <h2 className="text-xl font-semibold mb-2">Success</h2>
                <p className="text-gray-700 mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SuccessDialog;
