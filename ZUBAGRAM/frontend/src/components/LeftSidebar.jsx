import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search as SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import CreatePost from './CreatePost';
import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import SearchModal from './SearchModal';
import logo from '../assets/zubagramlogo.png';

const LeftSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('zubagram-vercel-4d4f.vercel.app/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
            setIsSidebarOpen(false); // Close sidebar on route change
        } else if (textType === "Home") {
            navigate("/");
            setIsSidebarOpen(false); // Close sidebar on route change
        } else if (textType === 'Messages') {
            navigate("/chat");
            setIsSidebarOpen(false); // Close sidebar on route change
        } else if (textType === "Search") {
            setSearchOpen(prev => !prev);
        }
    };

    const sidebarItems = [
        { icon: <Home className='text-gray-400' />, text: "Home" },
        { icon: <SearchIcon className='text-gray-400' />, text: "Search" },
        { icon: <MessageCircle className='text-gray-400' />, text: "Messages" },
        {
            icon: (
                <Popover>
                    <PopoverTrigger asChild>
                        <div className='relative flex items-center rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ease-in-out duration-300'>
                            <div className='relative flex items-center'>
                                <Heart className='text-gray-400 transition-transform transform hover:scale-110' />
                                {likeNotification.length > 0 && (
                                    <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                        {likeNotification.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='bg-gray-900 text-white'>
                        <div>
                            {likeNotification.length === 0 ? (
                                <p>No new notifications</p>
                            ) : (
                                likeNotification.map(notification => (
                                    <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                        <Avatar>
                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p className='text-sm'>
                                            <span className='font-bold'>{notification.userDetails?.username}</span> liked your post
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            ),
            text: "Notifications"
        },
        { icon: <PlusSquare className='text-gray-400' />, text: "Create" },
        {
            icon: (
                <Avatar className='w-8 h-8'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut className='text-gray-400' />, text: "Logout" },
    ];

    return (
        <div className='sidebar pt-3 fixed top-0 z-40 left-0 pl-6 pr-3 border-r border-gray-700 bg-gray-900 h-screen w-64 lg:w-72 xl:w-80'>
            <div className='flex flex-col text-white'>
                <div className='flex items-center mb-2'>
                    <img className='w-12 h-12 rounded-full' src={logo} alt="Zubagram Logo" />
                    <h1 className='ml-1 pb-1 text-2xl font-bold'>ZUBAGRAM</h1>
                </div>
                <div>
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => sidebarHandler(item.text)}
                            className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ease-in-out duration-300'
                        >
                            {item.icon}
                            <span className='text-lg font-medium'>{item.text}</span>
                        </div>
                    ))}
                </div>
                <CreatePost open={open} setOpen={setOpen} />
            </div>
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
    );
};

export default LeftSidebar;
