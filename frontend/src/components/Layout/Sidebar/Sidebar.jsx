import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Archive, 
  Globe, 
  Settings, 
  User,
  MessageSquare,
  Folder,
  Hash,
  Pin,
  X 
} from 'lucide-react';
import NavSection from './NavSection';
import './Sidebar.css';

const Sidebar = ({ 
  threads, 
  activeThreadId, 
  setActiveThreadId, 
  createNewThread,
  deleteThread
}) => {
  const [activeView, setActiveView] = useState('search'); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Toggle View Logic
  const toggleView = (view) => {
    if (activeView === view && isDrawerOpen) {
      if (!isPinned) setIsDrawerOpen(false); 
    } else {
      setActiveView(view);
      setIsDrawerOpen(true);
    }
  };

  const handleNewThread = () => {
    createNewThread();
    setActiveView('search'); 
    if (!isPinned) setIsDrawerOpen(false);
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsDrawerOpen(false);
    }
  };

  const handleDeleteClick = (e, threadId) => {
    e.stopPropagation();
    if (confirm('Permanently delete this project?')) {
      deleteThread(threadId);
    }
  };

  // Mock Data Generators for "Load More" demonstration
  const articlesMock = Array.from({ length: 20 }, (_, i) => ({
    id: `art-${i}`,
    title: `Article Draft ${i + 1}: The Future of AI`,
    icon: Folder
  }));

  const novelsMock = Array.from({ length: 15 }, (_, i) => ({
    id: `nov-${i}`,
    title: `Chapter ${i + 1}: The Awakening`,
    icon: Hash
  }));

  // Render Helpers
  const renderThreadItem = (t) => (
    <div 
      key={t.id} 
      className={`drawer-item group ${activeThreadId === t.id ? 'active' : ''}`}
      onClick={() => setActiveThreadId(t.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <MessageSquare size={16} style={{ flexShrink: 0 }} />
        <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {t.title || 'Untitled Thread'}
        </span>
      </div>
      <button 
        className="delete-btn"
        onClick={(e) => handleDeleteClick(e, t.id)}
      >
        <X size={14} />
      </button>
    </div>
  );

  const renderGenericItem = (item) => {
    const Icon = item.icon;
    return (
      <div key={item.id} className="drawer-item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <Icon size={16} style={{ flexShrink: 0 }} />
          <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {item.title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="sidebar-container" onMouseLeave={handleMouseLeave}>
      
      {/* 1. Navigation Rail */}
      <div className="nav-rail">
        <div className="rail-section top">
          <div 
            className="rail-item primary-action" 
            onClick={handleNewThread}
            data-tooltip="New Thread"
          >
            <Plus size={24} />
          </div>

          <div 
            className={`rail-item ${activeView === 'search' && (!isDrawerOpen || isPinned) ? 'active' : ''}`}
            onClick={() => { setActiveView('search'); if (!isPinned) setIsDrawerOpen(false); }}
            data-tooltip="Search / Home"
          >
            <Search size={22} />
          </div>

          <div 
            className={`rail-item ${activeView === 'archives' && isDrawerOpen ? 'active' : ''}`}
            onClick={() => toggleView('archives')}
            data-tooltip="Archives & History"
          >
            <Archive size={22} />
          </div>

          <div 
            className={`rail-item ${activeView === 'discover' ? 'active' : ''}`}
            onClick={() => toggleView('discover')}
            data-tooltip="Discover"
          >
            <Globe size={22} />
          </div>
        </div>

        <div className="rail-section bottom">
          <div className="rail-item" data-tooltip="Settings">
            <Settings size={22} />
          </div>
          <div className="rail-item" data-tooltip="Profile">
            <User size={22} />
          </div>
        </div>
      </div>

      {/* 2. Side Drawer */}
      <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
        
        {(activeView === 'archives' || (activeView === 'search' && isDrawerOpen)) && (
          <>
            <div className="drawer-header">
              <span>Archives</span>
              <button 
                className={`pin-button ${isPinned ? 'active' : ''}`}
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? "Unpin Drawer" : "Pin Drawer"}
              >
                <Pin size={16} />
              </button>
            </div>
            
            {/* Scrollable Content Area with Custom Scrollbar */}
            <div className="drawer-content custom-scroll">
              
              {/* Recent Chats Section */}
              <NavSection 
                title="Recent Chats" 
                items={threads || []} 
                renderItem={renderThreadItem}
                initialVisible={7}
              />

              {/* Articles Section (Mock) */}
              <NavSection 
                title="Articles" 
                items={articlesMock} 
                renderItem={renderGenericItem}
                initialVisible={5}
              />

              {/* Novels Section (Mock) */}
              <NavSection 
                title="Novels" 
                items={novelsMock} 
                renderItem={renderGenericItem}
                initialVisible={5}
              />

            </div>
          </>
        )}

        {/* Content for DISCOVER View */}
        {activeView === 'discover' && (
          <>
            <div className="drawer-header">
              <span>Discover</span>
              <button 
                className={`pin-button ${isPinned ? 'active' : ''}`}
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? "Unpin Drawer" : "Pin Drawer"}
              >
                <Pin size={16} />
              </button>
            </div>
            <div className="drawer-content custom-scroll">
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
