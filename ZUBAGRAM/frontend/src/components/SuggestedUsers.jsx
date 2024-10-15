import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { setSuggestedUsers } from '@/redux/authSlice'; // Assuming you have an action to set suggested users

const SuggestedUsers = () => {
    const dispatch = useDispatch();
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const [followStates, setFollowStates] = useState({});

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('https://zubagram-vercel-4tkk.vercel.app/api/v1/user/suggested', { withCredentials: true });
                if (res.data.success) {
                    const users = res.data.users;
                    dispatch(setSuggestedUsers(users));

                    const initialFollowStates = users.reduce((acc, suggestedUser) => {
                        const isFollowing = suggestedUser.followers.includes(user._id);
                        acc[suggestedUser._id] = isFollowing;
                        return acc;
                    }, {});

                    setFollowStates(initialFollowStates);
                }
            } catch (error) {
                console.error('Error fetching suggested users:', error);
            }
        };

        fetchSuggestedUsers();
    }, [dispatch, user._id]);

    const handleFollowUnfollow = async (targetUserId) => {
        const currentlyFollowing = followStates[targetUserId];

        try {
            setFollowStates(prev => ({
                ...prev,
                [targetUserId]: !currentlyFollowing
            }));

            const res = await axios.post(`https://zubagram-vercel-4tkk.vercel.app/api/v1/user/followorunfollow/${targetUserId}`, {}, {
                withCredentials: true,
            });

            if (!res.data.success) {
                setFollowStates(prev => ({
                    ...prev,
                    [targetUserId]: currentlyFollowing
                }));
            }
        } catch (error) {
            console.log('Error following/unfollowing user:', error);
            setFollowStates(prev => ({
                ...prev,
                [targetUserId]: currentlyFollowing
            }));
        }
    };

    return (
        <div className='bg-gray-900 text-white rounded-lg w-full p-4'>
            <div className='flex items-center justify-between text-sm mb-4'>
                <h1 className='font-semibold text-gray-400 text-lg md:text-xl lg:text-2xl'>Suggested for you</h1>
                <span className='font-medium cursor-pointer hover:text-blue-500 text-sm md:text-base lg:text-lg'>See All</span>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                {suggestedUsers.map(suggestedUser => {
                    const isFollowing = followStates[suggestedUser._id] || false;
                    return (
                        <div key={suggestedUser._id} className='relative bg-gray-800 rounded-lg overflow-hidden shadow-lg h-40'>
                            <div 
                                className='absolute inset-0 bg-cover bg-center'
                                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1636956005303-6d19b07b2138?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
                            >
                                <div className='absolute inset-0 bg-black opacity-60'></div>
                            </div>
                            <div className='relative z-10 p-2'>
                                <Link to={`/profile/${suggestedUser._id}`}>
                                    <Avatar className='h-12 w-12 mx-auto mb-2'>
                                        <AvatarImage src={suggestedUser.profilePicture} alt="profile_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <h1 className='font-semibold text-center text-sm md:text-base lg:text-lg'>
                                    <Link to={`/profile/${suggestedUser._id}`} className='hover:underline'>{suggestedUser.username}</Link>
                                </h1>
                                <p className='text-gray-300 text-xs text-center mt-1 md:text-sm lg:text-base'>{suggestedUser.bio || 'Bio here...'}</p>
                                <div className='flex justify-center mt-2'>
                                    <button
                                        onClick={() => handleFollowUnfollow(suggestedUser._id)}
                                        className={`px-3 py-1 rounded-full font-bold ${isFollowing ? 'bg-red-500 text-white' : 'bg-blue-400 text-white'} hover:bg-opacity-80 transition-colors`}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SuggestedUsers;
