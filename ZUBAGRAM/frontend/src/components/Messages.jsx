import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='relative flex-1 p-4 overflow-hidden'>
            <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1636955890525-84c5fa482c85?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}></div>
            <div className='absolute inset-0 bg-black opacity-50'></div> {/* Darkening overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent'></div> {/* Fading edges */}

            <div className='relative z-10 flex flex-col gap-3'>
                <div className='flex justify-center mb-4'>
                    <div className='flex flex-col items-center'>
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='text-lg font-semibold mt-2'>{selectedUser?.username}</span>
                        <Link to={`/profile/${selectedUser?._id}`}>
                            <Button className="h-8 mt-2 text-zinc-400" variant="outline">View profile</Button>
                        </Link>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    {messages && messages.map((msg) => (
                        <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 rounded-lg max-w-[80%] break-words whitespace-wrap text-wrap ${msg.senderId === user?._id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Messages;
