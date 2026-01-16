import React, { useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';
import MessageItem from '../MessageItem/MessageItem';

const MessageStream = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-history">
      {messages.length === 0 && (
        <div className="empty-state">
          <Zap size={48} color="var(--accent-lavender)" />
          <p>Empty Thread - Start the conversation below</p>
        </div>
      )}
      {messages.map((m, idx) => (
        <MessageItem key={m.id || idx} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageStream;
