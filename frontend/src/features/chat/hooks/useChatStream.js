import { useState, useCallback, useEffect } from 'react';
import { chatApi } from '../api/chat.api';

export const useChatStream = (activeThreadId, mode) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const fetchMessages = useCallback(async (id) => {
    try {
      const res = await chatApi.fetchMessages(id);
      setMessages(res.data);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId);
    }
  }, [activeThreadId, fetchMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming || !activeThreadId) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsStreaming(true);

    try {
      const response = await fetch(chatApi.streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: activeThreadId,
          message: inputValue,
          mode: mode,
          model: 'gemma3:4b'
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      const assistantId = 'assistant-' + Date.now();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); 

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              setIsStreaming(false);
              continue;
            }
            try {
              const data = JSON.parse(dataStr);
              assistantContent += data.content;
              setMessages(prev => prev.map(m => 
                m.id === assistantId ? { ...m, content: assistantContent } : m
              ));
            } catch (error) {
              console.error('Data parsing error in hook:', error, 'Line:', line);
            }
          }
        }
      }
    } catch (err) {
      console.error('Stream error:', err);
      setIsStreaming(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    handleSendMessage
  };
};
