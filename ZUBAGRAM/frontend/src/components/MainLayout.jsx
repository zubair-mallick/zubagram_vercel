import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import { Menu } from 'lucide-react'; // Ensure you have lucide-react installed for the hamburger icon

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // Hook to get the current location

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  useEffect(() => {
    // Close the sidebar when the route changes
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className='flex text-white min-h-screen max-w-fit'>
      {/* Hamburger Menu Button */}
      <button
        className='fixed top-4 left-0 z-50 p-2 rounded-full'
        onClick={toggleSidebar}
      >
        <Menu className='w-6 h-6 text-gray-300' />
      </button>

      {/* Conditional Rendering of Sidebar */}
      {isSidebarOpen && <LeftSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}

      <div className={`flex-1 flex items-center transition-transform duration-300 w-screen`}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
