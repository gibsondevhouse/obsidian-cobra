import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ value, onChange, onSend, disabled, mode }) => {
  const getPlaceholder = () => {
    if (mode === 'chat') return 'Ask anything...';
    if (mode === 'search') return 'Search the web...';
    return 'Start a deep research...';
  };

  return (
    <div className="input-area">
      <div className="pill-input-container">
        <input 
          className="pill-input" 
          placeholder={getPlaceholder()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          disabled={disabled}
        />
        <button 
          className="send-button" 
          onClick={onSend}
          disabled={disabled || !value.trim()}
        >
          <Send size={18} color="#000" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
