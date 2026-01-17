import React from 'react';
import Sidebar from './Sidebar/Sidebar';

const Layout = ({ 
  children, 
  threads, 
  activeThreadId, 
  setActiveThreadId, 
  createNewThread,
  deleteThread // Added prop
}) => {
  return (
    <div className="app-layout">
      <Sidebar 
        threads={threads} 
        activeThreadId={activeThreadId} 
        setActiveThreadId={setActiveThreadId} 
        createNewThread={createNewThread} 
        deleteThread={deleteThread} // Passed down
      />
      <main className="feature-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
