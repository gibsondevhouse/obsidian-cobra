import React, { useRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { FolderPlus, FilePlus, Trash2, Database, Loader2 } from 'lucide-react';

const ChatHeader = ({ mode, setMode }) => {
  const { 
    folders, 
    files, 
    addFolder, 
    addIndividualFiles, 
    clearAll, 
    isProcessing 
  } = useChatContext();

  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const totalFiles = files.length + folders.reduce((acc, folder) => acc + folder.files.length, 0);

  return (
    <header className="feature-header" style={{ justifyContent: 'space-between', gap: '20px' }}>
      
      {/* LEFT: Context Controller */}
      <div className="context-controller" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* Hidden Inputs */}
        <input 
          type="file" 
          ref={folderInputRef} 
          style={{ display: 'none' }}
          onChange={(e) => addFolder(e.target.files)}
          webkitdirectory="" 
          directory="" 
          multiple 
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }}
          onChange={(e) => addIndividualFiles(e.target.files)}
          multiple 
        />

        {/* Controls */}
        <button 
          className="mode-btn" 
          onClick={() => folderInputRef.current?.click()}
          title="Add Folder"
        >
          <FolderPlus size={16} /> 
          <span style={{ marginLeft: '6px', fontSize: '12px' }}>{folders.length}/2</span>
        </button>

        <button 
          className="mode-btn" 
          onClick={() => fileInputRef.current?.click()}
          title="Add Files"
        >
          <FilePlus size={16} />
          <span style={{ marginLeft: '6px', fontSize: '12px' }}>{files.length}/3</span>
        </button>

        {totalFiles > 0 && (
          <>
            <div style={{ height: '20px', width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
            
            <div className="status-badge" style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              fontSize: '12px', color: 'var(--accent-lavender)',
              background: 'rgba(179, 157, 219, 0.1)', padding: '4px 10px', borderRadius: '99px'
            }}>
              {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
              <span>{totalFiles} items loaded</span>
            </div>

            <button 
              className="mode-btn" 
              onClick={clearAll} 
              style={{ color: '#ff4d4d' }}
              title="Clear Context"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>

      {/* RIGHT: Mode Switcher */}
      <div className="mode-switcher">
        <button className={`mode-btn ${mode === 'chat' ? 'active' : ''}`} onClick={() => setMode('chat')}>Chat</button>
        <button className={`mode-btn ${mode === 'search' ? 'active' : ''}`} onClick={() => setMode('search')}>Search</button>
        <button className={`mode-btn ${mode === 'research' ? 'active' : ''}`} onClick={() => setMode('research')}>Research</button>
      </div>
    </header>
  );
};

export default ChatHeader;
