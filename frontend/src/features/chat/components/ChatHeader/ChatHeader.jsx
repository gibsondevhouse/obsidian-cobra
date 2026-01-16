import React from 'react';

const ChatHeader = ({ mode, setMode }) => {
  return (
    <header className="feature-header">
      <div className="mode-switcher">
        <button className={`mode-btn ${mode === 'chat' ? 'active' : ''}`} onClick={() => setMode('chat')}>Chat</button>
        <button className={`mode-btn ${mode === 'search' ? 'active' : ''}`} onClick={() => setMode('search')}>Search</button>
        <button className={`mode-btn ${mode === 'research' ? 'active' : ''}`} onClick={() => setMode('research')}>Research</button>
      </div>
    </header>
  );
};

export default ChatHeader;
