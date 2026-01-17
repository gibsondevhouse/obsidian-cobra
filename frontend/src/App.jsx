import React, { useState } from 'react';
import axios from 'axios';
import Layout from './components/Layout/Layout';
import ChatFeature from './features/chat/ChatFeature';
import './styles/design-system.css';

const API_BASE = 'http://localhost:3001/api/v1';

function App() {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [mode, setMode] = useState('chat'); // chat, search, research

  const createNewThread = React.useCallback(async () => {
    try {
      const res = await axios.post(`${API_BASE}/threads`, { 
        title: 'New Session',
        mode: mode 
      });
      setThreads(prev => [res.data, ...prev]);
      setActiveThreadId(res.data.id);
    } catch (err) {
      console.error('Create thread error:', err);
    }
  }, [mode]);

  const fetchThreads = React.useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/threads`);
      setThreads(res.data);
      if (res.data.length > 0) {
        // Only set active if we don't have one and just loaded list
        // (logic depends on your preference, but usually keep existing selection)
        if (!activeThreadId) setActiveThreadId(res.data[0].id);
      } else {
        createNewThread();
      }
    } catch (err) {
      console.error('Fetch threads error:', err);
    }
  }, [activeThreadId, createNewThread]);

  // Added Delete Handler
  const deleteThread = React.useCallback(async (threadId) => {
    // 1. Optimistic UI update
    setThreads(prev => prev.filter(t => t.id !== threadId));
    
    // 2. If deleting active thread, switch to next available or null
    if (activeThreadId === threadId) {
      setActiveThreadId(null);
    }

    // 3. API Call
    try {
      await axios.delete(`${API_BASE}/threads/${threadId}`);
    } catch (err) {
      console.error('Delete thread error:', err);
      // Revert optimization on error? (Optional, usually we just alert)
      fetchThreads(); 
    }
  }, [activeThreadId, fetchThreads]);

  React.useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return (
    <Layout 
      threads={threads} 
      activeThreadId={activeThreadId} 
      setActiveThreadId={setActiveThreadId} 
      createNewThread={createNewThread}
      deleteThread={deleteThread} 
    >
      <ChatFeature 
        activeThreadId={activeThreadId} 
        mode={mode} 
        setMode={setMode} 
        onMessageSent={fetchThreads}
      />
    </Layout>
  );
}

export default App;
