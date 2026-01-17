import React from 'react';
import { useChatStream } from './hooks/useChatStream';
import ChatHeader from './components/ChatHeader/ChatHeader';
import MessageStream from './components/MessageStream/MessageStream';
import ChatInput from './components/ChatInput/ChatInput';

const ChatFeature = ({ activeThreadId, mode, setMode, onMessageSent }) => {
  const {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    handleSendMessage,
    connectionStatus,
    retryLastMessage,
    contextUsage
  } = useChatStream(activeThreadId, mode, onMessageSent);

  return (
    <div className="chat-feature-container">
      <ChatHeader mode={mode} setMode={setMode} />
      
      <MessageStream messages={messages} />

      <ChatInput 
        value={inputValue} 
        onChange={setInputValue} 
        onSend={handleSendMessage} 
        disabled={isStreaming} 
        mode={mode}
        connectionStatus={connectionStatus}
        onRetry={retryLastMessage}
        usage={contextUsage}
      />
      
      {connectionStatus === 'disconnected' && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 59, 48, 0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          zIndex: 100
        }} onClick={retryLastMessage}>
          ⚠ Offline - Click to Retry
        </div>
      )}
    </div>
  );
};

export default ChatFeature;
