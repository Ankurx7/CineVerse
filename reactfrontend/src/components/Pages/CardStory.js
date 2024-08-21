import React from 'react';
import { Link } from 'react-router-dom';

const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const Story = ({ story }) => {
  const truncateContent = (content) => {
    const strippedContent = stripHtml(content);
    return strippedContent.length > 73 ? strippedContent.substr(0, 73) + "..." : strippedContent;
  };

  const truncateTitle = (title) => title.length > 69 ? title.substr(0, 69) + "..." : title;

  return (
    <div className="flex justify-center my-2">
      <div className="max-w-[900px] w-full bg-white rounded-lg shadow-lg overflow-hidden flex transition-transform transform hover:scale-105 hover:shadow-2xl duration-200 ease-in-out" style={{ height: '240px' }}>
        <Link to={`/story/${story.slug}`} className="flex w-full">
          {/* Image Section */}
          <div className="w-[30%] h-full">
            <img
              className="w-full h-full object-cover"
              src={`/storyImages/${story.image}`}
              alt={story.title}
            />
          </div>

          {/* Content Section */}
          <div className="w-[70%] flex">

            {/* Text */}
            <div className="p-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-2">
                {truncateTitle(story.title)}
              </h5>
              <p className="text-gray-600 text-sm mb-3">
                {truncateContent(story.content)}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Story;
