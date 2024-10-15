import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { setUserProfile, setSelectedUser } from '@/redux/authSlice';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile, user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  useGetUserProfile(userId);

  useEffect(() => {
    if (user && userProfile) {
      setIsFollowing(userProfile.followers.includes(user._id));
    }
  }, [userProfile, user]);

  const handleFollowUnfollow = async () => {
    const newFollowingStatus = !isFollowing;

    try {
      setIsFollowing(newFollowingStatus);

      const res = await axios.post(`https://zubagram-vercel-4tkk.vercel.app/api/v1/user/followorunfollow/${userId}`, {}, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUserProfile(res.data.userProfile));
      } else {
        setIsFollowing(!newFollowingStatus);
      }
    } catch (error) {
      console.log('Error following/unfollowing user:', error);
      setIsFollowing(!newFollowingStatus);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const handleMessageClick = (id) => {
    dispatch(setSelectedUser(userProfile));
    navigate(`/chat/${id}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full text-white">
      {/* Main Background with Fading Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1636955890525-84c5fa482c85?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          filter: 'brightness(70%)', // Darken the background image
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mt-[2vh] p-6 bg-zinc-300 bg-opacity-80 rounded-md shadow-lg">
        {/* Header Section with Darkened Background Image */}
        <div
          className="header flex flex-col md:flex-row w-full justify-between items-center py-6 px-4 mb-4 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-md"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1636956005303-6d19b07b2138?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(85%)',
          }}
        >
          <div className="flex flex-col items-center md:flex-row gap-4">
            <Avatar className="h-32 w-32 md:mr-8 border-4 border-red-300">
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-100">{userProfile?.username}</h1>
              <div className="flex gap-6 mt-2 bg-red-800 px-3 py-1 rounded-lg shadow-md">
                <p><span className="font-extrabold text-white">{userProfile?.followers.length}</span> followers</p>
                <span className='w-[1px] bg-white'></span>
                <p><span className="font-extrabold text-white">{userProfile?.following.length}</span> following</p>
              </div>
              {user?._id === userProfile?._id ? (
                <Link to="/account/edit">
                  <Button variant="secondary" className="mt-4">Edit Profile</Button>
                </Link>
              ) : (
                <div className="flex gap-4 mt-4">
                  <Button
                    className={`h-10 ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={handleFollowUnfollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button variant="secondary" onClick={() => handleMessageClick(userProfile?._id)}>Message</Button>
                </div>
              )}
              <p className="mt-4 text-red-600 bg-red-100 px-3 py-1 rounded-lg font-bold">{userProfile?.bio || 'Bio here...'}</p>
              <Badge className="mt-2" variant="secondary"><AtSign /> <span className="pl-1">{userProfile?.username}</span></Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bs flex justify-center gap-2 text-sm border-t border-gray-700 w-full bg-red-500 rounded-md shadow-md">
        <span className='w-[1px] bg-white'></span>
          <span className={`py-3 px-6 cursor-pointer transition-transform duration-300 ${activeTab === 'posts' ? 'font-bold text-white border-b-4 border-white' : 'text-gray-200 hover:text-white'}`} onClick={() => handleTabChange('posts')}>
            POSTS
          </span>
          <span className='w-[1px] bg-white'></span>
          <span className={`py-3 px-6 cursor-pointer transition-transform duration-300 ${activeTab === 'saved' ? 'font-bold text-white border-b-4 border-white' : 'text-gray-200 hover:text-white'}`} onClick={() => handleTabChange('saved')}>
            SAVED
          </span>
          <span className='w-[1px] bg-white'></span>
        </div>

        {/* Post Grid */}
        <div className="mt-4 w-full max-w-4xl h-[32vh] overflow-y-auto bg-zinc-700 p-4 rounded-md shadow-md">
          <div className="grid grid-cols-3 gap-4">
            {displayedPost?.map((post) => (
              <div key={post?._id} className="relative group cursor-pointer rounded-md overflow-hidden shadow-md">
                <img src={post.image} alt="postimage" className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
