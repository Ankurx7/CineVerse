import React, { useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${searchTerm.trim()}`);
        }
        setSearchTerm('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <input
                type="text"
                placeholder="Type the series or movie name"
                className="px-2 py-1 border rounded-lg text-green-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-500 px-3 py-1 rounded-r"
                disabled={!searchTerm.trim()}
            >
                <BiSearchAlt2 />
            </button>
        </form>
    );
};

export default SearchForm;
