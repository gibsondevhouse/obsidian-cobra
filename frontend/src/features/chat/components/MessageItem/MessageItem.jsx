import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';

const MessageItem = ({ message }) => {
  const { role, content } = message;

  return (
    <div className={`message-row ${role}`}>
      <div className="message-container">
        <div className={`avatar-container ${role}`}>
          {role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div className="message-content">
          {role === 'assistant' ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
