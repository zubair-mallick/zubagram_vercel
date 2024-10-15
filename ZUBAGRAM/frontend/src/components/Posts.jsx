import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector(store => store.post);

  return (
    <div 
      className='relative flex flex-col items-center w-screen bg-cover bg-center'
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1636955890525-84c5fa482c85?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="absolute inset-0 z-0 flex">
        <div className="w-1/6 h-full bg-gradient-to-r from-zinc-800"></div>
        <div className="flex-grow"></div>
        <div className="w-1/6 h-full bg-gradient-to-l from-zinc-800"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center w-full">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
