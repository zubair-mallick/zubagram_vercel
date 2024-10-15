import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
    return (
        <div className='mb-2'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm text-white'>
                    {comment?.author.username} 
                    <span className='font-normal pl-1 text-gray-300'>{comment?.text}</span>
                </h1>
            </div>
        </div>
    );
}

export default Comment;
