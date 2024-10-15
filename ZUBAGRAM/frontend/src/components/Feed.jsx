import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className='flex-1  flex flex-col max-w-fit   bg-gray-900 text-white'>
      <Posts />
    </div>
  );
}

export default Feed;
