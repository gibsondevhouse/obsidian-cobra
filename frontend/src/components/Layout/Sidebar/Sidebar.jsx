import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Image, 
  LayoutGrid, 
  Terminal, 
  Box,
  Folder,
  ChevronDown,
  MoreHorizontal,
  Settings,
  User
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  threads, 
  activeThreadId, 
  setActiveThreadId, 
  createNewThread 
}) => {
  return (
    <aside className="sidebar-container">
      {/* Top Section */}
      <div className="sidebar-section">
        <SidebarItem icon={<Plus size={18} />} label="New chat" onClick={createNewThread} />
        <SidebarItem icon={<Search size={18} />} label="Search chats" />
        <SidebarItem icon={<Image size={18} />} label="Images" />
        <SidebarItem icon={<LayoutGrid size={18} />} label="Apps" />
        <SidebarItem icon={<Terminal size={18} />} label="Codex" />
        <SidebarItem icon={<Box size={18} />} label="GPTs" />
      </div>

      {/* Projects Section */}
      <div className="sidebar-label">Projects</div>
      <div className="sidebar-section">
        <SidebarItem icon={<Plus size={18} />} label="New project" />
        <SidebarItem icon={<Folder size={18} />} label="Durango Domicile" />
        <SidebarItem icon={<Folder size={18} />} label="Bible Study" />
      </div>

      {/* Group Chats Section */}
      <div className="sidebar-label">Group chats</div>
      <div className="sidebar-section">
        <SidebarItem 
          icon={<div className="avatar-mini purple">MW</div>} 
          label="Lily Draft 1" 
        />
        <SidebarItem 
          icon={<div className="avatar-mini purple">MW</div>} 
          label="Dream Analysis of Betrayal" 
        />
        <SidebarItem icon={<div className="avatar-mini outline">U</div>} label="New group chat" />
      </div>

      {/* Your Chats Section */}
      <div className="sidebar-label">Your chats</div>
      <div className="sidebar-section scrollable">
        {threads.map(t => (
          <SidebarItem 
            key={t.id} 
            icon={<MessageSquare size={16} />} 
            label={t.title} 
            active={activeThreadId === t.id}
            onClick={() => setActiveThreadId(t.id)}
          />
        ))}
      </div>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar-circle">CG</div>
          <div className="user-info">
            <div className="user-name">Christopher Gibson</div>
            <div className="user-plan">Plus</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div 
    className={`sidebar-item ${active ? 'active' : ''}`} 
    onClick={onClick}
  >
    <span className="sidebar-item-icon">{icon}</span>
    <span className="sidebar-item-label">{label}</span>
  </div>
);

export default Sidebar;
