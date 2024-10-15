import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(sidebarRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(
      sidebarRef.current.querySelectorAll('.animate-item'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out" },
      "<"
    );
  }, []);

  return (
    <div 
      ref={sidebarRef}
      className='relative px-4 w-screen bg-cover bg-center shadow-lg border border-gray-700 overflow-hidden'
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1636956005303-6d19b07b2138?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-8 flex items-center gap-3 p-4 bg-gray-900 bg-opacity-70 animate-item">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className='h-12 w-12 animate-item'>
            <AvatarImage src={user?.profilePicture} alt="profile_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-lg text-white animate-item'>
            <Link to={`/profile/${user?._id}`} className='hover:underline'>
              {user?.username}
            </Link>
          </h1>
          <span className='text-gray-300 text-sm animate-item'>
            {user?.bio || 'Bio here...'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar;
