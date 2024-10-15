import React, { useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const SearchModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`https://zubagram-vercel-4tkk.vercel.app/api/v1/user/search/${searchQuery}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setSearchResults(res.data.users);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.log('Error searching for users:', error);
            setSearchResults([]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50'>
            <div className='bg-gray-900 text-white p-4 border border-gray-700 rounded-lg w-full max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Search</h2>
                    <Button onClick={onClose} className='text-gray-400 hover:text-white'>Close</Button>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className='mb-2 p-2 border border-gray-600 rounded w-full bg-gray-800 text-white'
                />
                <button
                    onClick={handleSearch}
                    className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                    Search
                </button>
                {searchResults.length > 0 && (
                    <div>
                        {searchResults.map(user => (
                            <div key={user._id} className='flex items-center gap-2 p-2'>
                                <Avatar>
                                    <AvatarImage src={user.profilePicture} alt="profile_image" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className='font-semibold text-sm'>
                                        <a href={`/profile/${user._id}`}>{user.username}</a>
                                    </h1>
                                    <span className='text-gray-300 text-sm'>{user.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;
