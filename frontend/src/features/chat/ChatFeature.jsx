import React from 'react';
import { useChatStream } from './hooks/useChatStream';
import ChatHeader from './components/ChatHeader/ChatHeader';
import MessageStream from './components/MessageStream/MessageStream';
import ChatInput from './components/ChatInput/ChatInput';

const ChatFeature = ({ activeThreadId, mode, setMode }) => {
  const {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    handleSendMessage
  } = useChatStream(activeThreadId, mode);

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
      />
    </div>
  );
};

export default ChatFeature;
