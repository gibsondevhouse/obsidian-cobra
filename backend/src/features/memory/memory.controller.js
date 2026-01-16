import { v4 as uuidv4 } from 'uuid';
import { MemoryService } from './memory.service.js';

export const MemoryController = {
  getThreads: (req, res) => {
    try {
      const threads = MemoryService.getThreads();
      res.json(threads);
    } catch (error) {
      console.error('getThreads Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  createThread: (req, res) => {
    try {
      const { title, mode } = req.body;
      const id = uuidv4();
      MemoryService.createThread(id, title || 'New Chat', mode || 'chat');
      res.json({ id, title, mode });
    } catch (error) {
      console.error('createThread Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getThread: (req, res) => {
    try {
      const thread = MemoryService.getThread(req.params.id);
      if (!thread) return res.status(404).json({ error: 'Thread not found' });
      res.json(thread);
    } catch (error) {
      console.error('getThread Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getMessages: (req, res) => {
    try {
      const messages = MemoryService.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error('getMessages Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
