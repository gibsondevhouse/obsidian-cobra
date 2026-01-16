import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';

const MessageItem = ({ message }) => {
  const { role, content } = message;

  // Simple reading time calculation (approx 200 words per minute)
  const getReadingTime = (text) => {
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className={`message-row ${role}`}>
      <div className="message-container">
        <div className="message-content">
          {role === 'assistant' && (
            <div className="reading-metadata">{getReadingTime(content)}</div>
          )}
          {role === 'assistant' ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            <div className="user-text">{content}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
