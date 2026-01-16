import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

export const chatApi = {
  fetchThreads: () => axios.get(`${API_BASE}/threads`),
  createThread: (title, mode) => axios.post(`${API_BASE}/threads`, { title, mode }),
  fetchMessages: (threadId) => axios.get(`${API_BASE}/threads/${threadId}/messages`),
  streamUrl: `${API_BASE}/chat/stream`
};
