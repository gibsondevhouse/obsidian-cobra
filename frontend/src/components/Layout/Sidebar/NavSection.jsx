
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';

const NavSection = ({ title, items, renderItem, initialVisible = 7, onTitleClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  // Toggle Collapse - exclusively for the button
  const toggleExpand = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); // Stops the click from bubbling
    setIsExpanded(!isExpanded);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + initialVisible);
  };

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = items.length > visibleCount;

  return (
    <div className="nav-section" style={{ marginBottom: '24px' }}>
      {/* HEADER: Split Title and Toggle */}
      <div 
        className="nav-section-header" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '8px',
          padding: '0 4px' // Added padding to match user's design
        }}
      >
        {/* 1. TITLE (Action/Link) */}
        {/* Clicking this executes onTitleClick (if provided), does NOT toggle */}
        <div 
          onClick={onTitleClick}
          className="drawer-section-label" 
          style={{ 
            margin: 0, 
            cursor: onTitleClick ? 'pointer' : 'default',
            flexGrow: 1,
            // Add hover effect if clickable
            ...(onTitleClick ? { transition: 'color 0.2s' } : {})
          }}
          onMouseEnter={(e) => {
            if (onTitleClick) e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            if (onTitleClick) e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {title}
        </div>
        
        {/* 2. SYMBOL (Toggle) */}
        {/* Clicking this toggles, does NOT navigate */}
        <button 
          onClick={toggleExpand}
          style={{ 
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            marginLeft: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--glass-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'transparent';
          }}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* LIST */}
      {isExpanded && (
        <div className="nav-section-list" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {visibleItems.map((item, idx) => renderItem(item, idx))}

          {/* THE "..." BUTTON */}
          {hasMore && (
            <button 
              onClick={handleLoadMore}
              className="load-more-btn"
              title="Load more results"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '8px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                marginTop: '4px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--glass-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <MoreHorizontal size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NavSection;
