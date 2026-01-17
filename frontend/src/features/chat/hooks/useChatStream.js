import { useReducer, useCallback, useEffect } from 'react';
import { chatApi } from '../api/chat.api';
import { useChatContext } from '../context/ChatContext';

// Action Types
const ACTION_TYPES = {
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_USER_MESSAGE: 'ADD_USER_MESSAGE',
  START_STREAM: 'START_STREAM',
  UPDATE_STREAM: 'UPDATE_STREAM',
  UPDATE_USAGE: 'UPDATE_USAGE',
  STREAM_ERROR: 'STREAM_ERROR',
  END_STREAM: 'END_STREAM',
  SET_INPUT: 'SET_INPUT',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS'
};

// Initial State
const initialState = {
  messages: [],
  inputValue: '',
  isStreaming: false,
  connectionStatus: 'connected',
  contextUsage: { current: 0, max: 8192 }
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_MESSAGES:
      return { ...state, messages: action.payload };

    case ACTION_TYPES.ADD_USER_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        inputValue: '',
        isStreaming: true,
        connectionStatus: 'connecting'
      };

    case ACTION_TYPES.START_STREAM:
      // Ensure we don't duplicate the assistant message if it already exists (safety check)
      if (state.messages.some(m => m.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        connectionStatus: 'connected',
        messages: [...state.messages, { ...action.payload, content: '' }]
      };

    case ACTION_TYPES.UPDATE_STREAM:
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.id 
            ? { ...msg, content: msg.content + action.payload.content }
            : msg
        )
      };

    case ACTION_TYPES.UPDATE_USAGE:
      return { ...state, contextUsage: action.payload };

    case ACTION_TYPES.STREAM_ERROR:
      return {
        ...state,
        isStreaming: false,
        connectionStatus: 'disconnected',
        messages: [...state.messages, {
          id: `error-${Date.now()}`,
          role: 'system',
          content: `> [!CAUTION]\n> **Stream Error**\n> ${action.payload}`
        }]
      };

    case ACTION_TYPES.END_STREAM:
      return { ...state, isStreaming: false };

    case ACTION_TYPES.SET_INPUT:
      return { ...state, inputValue: action.payload };
      
    case ACTION_TYPES.SET_CONNECTION_STATUS:
      return { ...state, connectionStatus: action.payload };

    default:
      return state;
  }
};

export const useChatStream = (activeThreadId, mode, onMessageSent) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { searchContext } = useChatContext();

  const fetchMessages = useCallback(async (id) => {
    try {
      const res = await chatApi.fetchMessages(id);
      dispatch({ type: ACTION_TYPES.SET_MESSAGES, payload: res.data });
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId);
    }
  }, [activeThreadId, fetchMessages]);

  const setInputValue = (value) => {
    dispatch({ type: ACTION_TYPES.SET_INPUT, payload: value });
  };

  const handleSendMessage = async (textOverride = null) => {
    const textToSend = textOverride || state.inputValue;
    if (!textToSend.trim() || state.isStreaming || !activeThreadId) return;

    const userMsgId = Date.now().toString();
    const userMsg = { id: userMsgId, role: 'user', content: textToSend };
    
    // 1. Optimistic Update
    dispatch({ type: ACTION_TYPES.ADD_USER_MESSAGE, payload: userMsg });

    // DYNAMICALLY INJECT CONTEXT
    // If the user's message mentions a file or topic, we search the context
    const relevantCode = searchContext(textToSend);
    
    const finalMessage = relevantCode 
      ? `[CONTEXT FILES FOUND]\n${relevantCode}\n\n[USER QUERY]\n${textToSend}`
      : textToSend;

    try {
      const response = await fetch(chatApi.streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: activeThreadId,
          message: finalMessage,
          mode: mode,
          model: 'gemma3:4b'
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      dispatch({ type: ACTION_TYPES.SET_CONNECTION_STATUS, payload: 'connected' });

      // 2. Initialize Stream Reading
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const assistantId = 'assistant-' + Date.now();
      
      // 3. Create Placeholder Message
      dispatch({ 
        type: ACTION_TYPES.START_STREAM, 
        payload: { id: assistantId, role: 'assistant' } 
      });

      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); 

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') {
            dispatch({ type: ACTION_TYPES.END_STREAM });
            if (onMessageSent) onMessageSent(); 
            continue;
          }

          try {
            const parsed = JSON.parse(dataStr);
            
            if (parsed.type === 'usage') {
              dispatch({ 
                type: ACTION_TYPES.UPDATE_USAGE, 
                payload: { current: parsed.current, max: parsed.max } 
              });
            } else if (parsed.content) {
              dispatch({ 
                type: ACTION_TYPES.UPDATE_STREAM, 
                payload: { id: assistantId, content: parsed.content } 
              });
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (error) {
            console.error('Stream processing error:', error);
            dispatch({ type: ACTION_TYPES.STREAM_ERROR, payload: error.message });
            return; 
          }
        }
      }
    } catch (err) {
      console.error('Stream error:', err);
      dispatch({ 
        type: ACTION_TYPES.STREAM_ERROR, 
        payload: `Unable to connect to the Neural Engine (Ollama). Please ensure the backend is running. (${err.message})` 
      });
    }
  };

  const retryLastMessage = () => {
    const lastUserMsg = [...state.messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
       handleSendMessage(lastUserMsg.content);
    }
  };

  return {
    messages: state.messages,
    inputValue: state.inputValue,
    setInputValue,
    isStreaming: state.isStreaming,
    contextUsage: state.contextUsage,
    connectionStatus: state.connectionStatus,
    handleSendMessage,
    retryLastMessage
  };
};
