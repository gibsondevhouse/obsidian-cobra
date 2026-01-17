import { useState, useCallback, useEffect } from 'react';
import { chatApi } from '../api/chat.api';

export const useChatStream = (activeThreadId, mode, onMessageSent) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected'); // 'connected', 'connecting', 'disconnected'

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

  const handleSendMessage = async (textOverride = null) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isStreaming || !activeThreadId) return;

    // UI Updates
    const userMsg = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputValue('');
    setIsStreaming(true);
    setConnectionStatus('connecting');

    try {
      const response = await fetch(chatApi.streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: activeThreadId,
          message: textToSend,
          mode: mode,
          model: 'gemma3:4b'
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setConnectionStatus('connected');

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
              if (onMessageSent) onMessageSent(); // Trigger refresh
              continue;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                 throw new Error(data.error);
              }
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
      setConnectionStatus('disconnected');
      
      // Proactive System Alert
      setMessages(prev => [...prev, {
        id: 'system-error-' + Date.now(),
        role: 'system',
        content: `> [!CAUTION]\n> **Connection Failed**\n> Unable to connect to the Neural Engine (Ollama). Please ensure the backend is running.\n\n[Retry](${textToSend})` // Heuristic retry link or just text
      }]);
    }
  };

  const retryLastMessage = () => {
    // Find last user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
       handleSendMessage(lastUserMsg.content);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    connectionStatus,
    handleSendMessage,
    retryLastMessage
  };
};
