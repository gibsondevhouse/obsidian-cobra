import { v4 as uuidv4 } from 'uuid';
import { MemoryService } from '../memory/memory.service.js';
import { ChatService } from './chat.service.js';

export const ChatController = {
  streamResponse: async (req, res) => {
    try {
      const { threadId, message, model, mode } = req.body;
      
      const thread = MemoryService.getThread(threadId);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      // 1. Save user message
      MemoryService.addMessage(uuidv4(), threadId, 'user', message);
      
      // 2. Prepare Context
      const history = MemoryService.getMessages(threadId).map(m => ({
        role: m.role,
        content: m.content
      }));

      let messages = history;
      if (mode === 'research') {
        messages = [
          { role: 'system', content: 'You are in RESEARCH mode. Provide a deep, structured analysis with citations and multi-perspective views. Begin by outlining your research steps.' },
          ...history
        ];
      } else if (mode === 'search') {
        messages = [
          { role: 'system', content: 'You are in SEARCH mode. Focus on providing factual, up-to-date information as if you just searched the live web. Use a concise, informative tone.' },
          ...history
        ];
      }

      // 3. Setup SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (mode === 'research') {
        res.write(`data: ${JSON.stringify({ content: '> [!NOTE]\n> **Initiating Research Phase...**\n> 1. Analyzing query scope...\n> 2. Identifying key domains...\n> 3. Synthesizing multi-perspective insights...\n\n---\n\n' })}\n\n`);
      }

      // 4. Stream from Ollama
      const stream = await ChatService.generateStream(messages, { model });
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); 
        
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              fullResponse += parsed.message.content;
              res.write(`data: ${JSON.stringify({ content: parsed.message.content })}\n\n`);
            }
            if (parsed.done) {
              MemoryService.addMessage(uuidv4(), threadId, 'assistant', fullResponse);
              res.write(`data: [DONE]\n\n`);
            }
          } catch (e) {
            console.error('JSON Parse error in ChatController:', e, 'Line:', line);
          }
        }
      }
      res.end();
    } catch (error) {
      console.error('Streaming Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  },

  listModels: async (req, res) => {
    try {
      const models = await ChatService.listModels();
      res.json(models);
    } catch (error) {
      console.error('listModels Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
