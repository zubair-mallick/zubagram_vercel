import React from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import Mydetail from './Mydetail';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import SuggestedUsers from './SuggestedUsers';

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();

    return (
        <div className='flex   lg:flex-row  text-white w-fit'>
            <div className='flex-grow '>
              <div className='mb-1 w-fit'>
              <Mydetail />
              </div >
                <div className='flex flex-col max-w-fit'> 
                <Feed />
               
                </div>
                <SuggestedUsers/>
                <Outlet />
            </div>
         
        </div>
    );
}

export default Home;
