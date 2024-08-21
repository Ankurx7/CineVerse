import { useState } from "react";
import { FaStar } from 'react-icons/fa';

const StarRating = ({ setStar, setStarCurrentVal, starCurrentVal }) => {
    const [hoverVal, setHoverVal] = useState(undefined);

    const handleClick = (val) => {
        setStarCurrentVal(val);
        setStar(val);
    };

    const handleMouseOver = (val) => {
        setHoverVal(val);
    };

    const handleMouseLeave = () => {
        setHoverVal(undefined);
    };

    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <FaStar
                        key={index}
                        size={21}
                        className={`cursor-pointer transition-colors duration-200 ease-in-out ${starValue <= (hoverVal || starCurrentVal) ? "text-blue-500" : "text-gray-400"}`}
                        onClick={() => handleClick(starValue)}
                        onMouseOver={() => handleMouseOver(starValue)}
                        onMouseLeave={handleMouseLeave}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;
