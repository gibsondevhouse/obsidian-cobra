import React from 'react';
import { Send, Zap } from 'lucide-react';

const ChatInput = ({ value, onChange, onSend, disabled, mode, usage }) => {
  // Calculate REMAINING percentage for the battery (100% -> 0%)
  const usageRatio = usage ? (usage.current / usage.max) : 0;
  const batteryPercent = Math.max(0, 100 - (usageRatio * 100));
  
  // Color logic: Green (High) -> Yellow (Med) -> Red (Low)
  const getBarColor = () => {
    if (batteryPercent > 50) return '#10b981'; // Emerald (Healthy)
    if (batteryPercent > 20) return '#eab308'; // Yellow (Warning)
    return '#ef4444'; // Red (Critical)
  };

  const getPlaceholder = () => {
    if (mode === 'chat') return 'Ask anything...';
    if (mode === 'search') return 'Search the web...';
    return 'Start a deep research...';
  };

  return (
    <div className="input-area">
      <div className="input-wrapper" style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
        
        {/* The Battery Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '-24px',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          opacity: 0.8
        }}>
          <Zap size={12} fill={getBarColor()} stroke="none" />
          <span>{Math.round(batteryPercent)}% Battery</span>
          
          {/* Progress Bar Track */}
          <div style={{
            width: '60px',
            height: '3px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            {/* Progress Bar Fill */}
            <div style={{
              width: `${batteryPercent}%`,
              height: '100%',
              background: getBarColor(),
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

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
    </div>
  );
};

export default ChatInput;
