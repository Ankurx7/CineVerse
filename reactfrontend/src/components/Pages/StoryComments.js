import React from 'react';
import CommentItem from './CommentItem';

const StoryComments = ({ commentlist, count, activeUser }) => {
    return (
        <>
            {count !== 0 ? (
                <div className='w-full relative'>
                    <h5 className='font-bold text-lg font-saira-condensed pl-2.5 pb-2 border-b border-gray-300 mb-8'>
                        MOST RELEVANT
                    </h5>
                    <div className="relative">
                        {commentlist.map((comment) => (
                            <CommentItem key={comment._id} comment={comment} activeUser={activeUser} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className='h-72 flex items-center justify-center text-center px-2.5 text-gray-600'>
                    There are currently no responses for this story. Be the first to respond.
                </div>
            )}
        </>
    );
};

export default StoryComments;
