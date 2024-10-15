import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const { id } = useParams();
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`zubagram-vercel-4d4f.vercel.app/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchSelectedUser = async () => {
            try {
                if (id) {
                    const res = await axios.get(`zubagram-vercel-4d4f.vercel.app/api/v1/user/${id}/profile`, {
                        withCredentials: true
                    });
                    dispatch(setSelectedUser(res.data.user));
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchSelectedUser();

        return () => {
            if (id) {
                dispatch(setSelectedUser(null));
            }
        };
    }, [id, dispatch]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && textMessage.trim()) {
            sendMessageHandler(selectedUser?._id);
        }
    };

    const filteredSuggestedUsers = suggestedUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='relative flex w-screen h-screen overflow-hidden'>
            {/* Background Image */}
            <div className='absolute inset-7 bg-cover bg-center' style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1636956005303-6d19b07b2138?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}></div>

            {/* Dark Overlay */}
            <div className='absolute inset-0 bg-black opacity-40'></div>

            {/* Blur Effect */}
            <div className='absolute inset-0 backdrop-blur-sm'></div>

            {/* Chat List Section */}
            <aside className='relative z-10 w-1/3 md:w-1/3 lg:w-1/5 bg-gray-800 bg-opacity-70 border-y-0 border-gray-900 border-4 flex-shrink-0 p-2 md:p-4 overflow-auto rounded-l-lg shadow-lg'>
                <div className='head shadow-2xl ml-2 uppercase rounded-lg bg-opacity-25'>
                    <h1 className='font-bold text-2xl ml-3 mb-4 text-white bg-clip-text bg-gradient-to-r from-blue-500 to-green-500'>
                        {user?.username}
                    </h1>
                    <hr className='mb-4 border-gray-900 border-2 rounded-md' />
                </div>
                {/* Search Input */}
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='mb-4 p-2 bg-gray-700 text-white rounded-lg focus:border-zinc-800'
                />
                <div className='space-y-2'>
                    {filteredSuggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div
                                key={suggestedUser._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className='relative flex gap-3 items-center p-3 rounded border border-gray-600 cursor-pointer transition-transform duration-300 hover:scale-105'
                                style={{
                                    backgroundImage: 'url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGNvbG9yfGVufDB8fDB8fHwy)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundBlendMode: 'overlay'
                                }}
                            >
                                {/* Dark Overlay */}
                                <div className='absolute inset-0 bg-black opacity-70 rounded'></div>

                                {/* Gradient Fade Effect */}
                                <div className='absolute inset-0'>
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent' style={{ height: '100%', width: '15%' }}></div>
                                    <div className='absolute inset-0 bg-gradient-to-l from-transparent via-black to-transparent' style={{ height: '100%', width: '15%' }}></div>
                                </div>

                                {/* Reflection Effect */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30'></div>

                                <Avatar className='relative z-10 w-8 h-8 md:w-12 md:h-12'>
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='relative z-10 flex flex-col '>
                                    <span className='font-medium text-gray-200'>{suggestedUser?.username}</span>
                                    <span className={`text-xs font-bold ${isOnline ? 'text-green-400' : 'text-red-500'}`}>{isOnline ? 'online' : 'offline'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Chat Area Section */}
            <main className='relative z-10 flex-1 flex flex-col'>
                {selectedUser ? (
                    <>
                        <header
                            className='flex items-center px-2 md:px-4 py-2 border-b border-gray-700 relative backdrop-blur-3xl'
                            style={{
                                backgroundImage: 'url("https://images.unsplash.com/photo-1636956005303-6d19b07b2138?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {/* Overlay with blur effect */}
                            <div className='absolute  bg-black opacity-30'></div>

                            {/* Content */}
                            <div className='relative z-10 flex items-center'>
                                <Avatar className='w-8 h-8 md:w-10 md:h-10'>
                                    <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='ml-2 md:ml-3'>
                                    <span className='text-white font-medium'>{selectedUser?.username}</span>
                                </div>
                            </div>
                        </header>
                        <Messages selectedUser={selectedUser} />
                        <footer
                            className='flex items-center p-2 md:p-4 border-t border-gray-700 relative backdrop-blur-3xl'
                            style={{
                                backgroundImage: 'url("https://images.unsplash.com/photo-1636956005303-6d19b07b2138?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {/* Overlay with blur effect */}
                            <div className='absolute  bg-black opacity-30'></div>

                            <Input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                type="text"
                                className='flex-1 mr-2 bg-gray-700 text-white focus-visible:ring-transparent rounded-lg'
                                placeholder="Type a message..."
                            />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)} className='bg-blue-600 hover:bg-blue-500'>
                                Send
                            </Button>
                        </footer>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center flex-1'>
                        <MessageCircleCode className='w-24 h-24 md:w-32 md:h-32 my-4 text-gray-500' />
                        <h1 className='font-medium text-gray-400'>Your messages</h1>
                        <span className='text-gray-500'>Send a message to start a chat.</span>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ChatPage;
