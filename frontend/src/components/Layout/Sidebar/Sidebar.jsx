import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Library, 
  Globe, 
  Settings, 
  User,
  MessageSquare,
  Folder,
  Hash
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  threads, 
  activeThreadId, 
  setActiveThreadId, 
  createNewThread 
}) => {
  // 'search' represents the main view. 'library' opens the drawer.
  const [activeView, setActiveView] = useState('search'); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Logic: Clicking the same icon closes the drawer; clicking a different one switches views.
  const toggleView = (view) => {
    if (activeView === view && isDrawerOpen) {
      setIsDrawerOpen(false); 
    } else {
      setActiveView(view);
      setIsDrawerOpen(true);
    }
  };

  const handleNewThread = () => {
    createNewThread();
    setActiveView('search'); // Reset to main view context
    setIsDrawerOpen(false);  // Auto-close drawer to focus on chat
  };

  return (
    <div className="sidebar-container">
      
      {/* 1. Navigation Rail (Fixed Left) */}
      <div className="nav-rail">
        
        {/* Top: Actions */}
        <div className="rail-section top">
          <div 
            className="rail-item primary-action" 
            onClick={handleNewThread}
            data-tooltip="New Thread"
          >
            <Plus size={24} />
          </div>

          <div 
            className={`rail-item ${activeView === 'search' && !isDrawerOpen ? 'active' : ''}`}
            onClick={() => { setActiveView('search'); setIsDrawerOpen(false); }}
            data-tooltip="Search / Home"
          >
            <Search size={22} />
          </div>

          <div 
            className={`rail-item ${activeView === 'library' && isDrawerOpen ? 'active' : ''}`}
            onClick={() => toggleView('library')}
            data-tooltip="Library & History"
          >
            <Library size={22} />
          </div>

          <div 
            className={`rail-item ${activeView === 'discover' ? 'active' : ''}`}
            onClick={() => toggleView('discover')}
            data-tooltip="Discover"
          >
            <Globe size={22} />
          </div>
        </div>

        {/* Bottom: User & Settings */}
        <div className="rail-section bottom">
          <div className="rail-item" data-tooltip="Settings">
            <Settings size={22} />
          </div>
          <div className="rail-item" data-tooltip="Profile">
            <User size={22} />
          </div>
        </div>
      </div>

      {/* 2. Side Drawer (Slide out panel) */}
      <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
        
        {/* Content for LIBRARY View */}
        {activeView === 'library' && (
          <>
            <div className="drawer-header">Library</div>
            <div className="drawer-content">
              
              <div className="drawer-section-label">Recent Chats</div>
              {threads && threads.length > 0 ? (
                threads.map(t => (
                  <div 
                    key={t.id} 
                    className={`drawer-item ${activeThreadId === t.id ? 'active' : ''}`}
                    onClick={() => { setActiveThreadId(t.id); }}
                  >
                    <MessageSquare size={16} />
                    <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {t.title || 'Untitled Thread'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="drawer-item" style={{opacity: 0.5}}>No history</div>
              )}

              <div className="drawer-section-label">Collections</div>
              <div className="drawer-item"><Folder size={16} /> Project Alpha</div>
              <div className="drawer-item"><Folder size={16} /> Research Notes</div>

              <div className="drawer-section-label">Groups</div>
              <div className="drawer-item"><Hash size={16} /> Engineering</div>
              <div className="drawer-item"><Hash size={16} /> Design Team</div>
            </div>
          </>
        )}

        {/* Content for DISCOVER View (Placeholder) */}
        {activeView === 'discover' && (
          <>
            <div className="drawer-header">Discover</div>
            <div className="drawer-content">
              <div className="drawer-item">Trending in Tech</div>
              <div className="drawer-item">AI Developments</div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
