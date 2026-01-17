import { v4 as uuidv4 } from 'uuid';
import { MemoryService } from '../memory/memory.service.js';
import { ChatService } from './chat.service.js';
import { SearchService } from '../search/search.service.js';

export const ChatController = {
  streamResponse: async (req, res) => {
    const { threadId, message, model, mode } = req.body;
    
    // Auto-titling check
    const thread = MemoryService.getThread(threadId);
    const shouldAutoTitle = thread && (thread.title === 'New Chat' || thread.title === 'New Session');

    const abortController = new AbortController();

    // 1. Setup Robust SSE Headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Crucial for Nginx/Proxies
    });

    // 2. Handle Client Disconnect (Stop generating if user leaves)
    req.on('close', () => {
      abortController.abort();
      res.end();
    });

    try {
      const thread = MemoryService.getThread(threadId);
      if (!thread) {
        throw new Error('Thread not found'); // Caught by catch block below
      }

      // 3. Persist User Message
      MemoryService.addMessage(uuidv4(), threadId, 'user', message);

      // 4. Build Context
      // Fetch specifically with a character limit (e.g. 20k) to prevent context overflow
      const history = MemoryService.getMessages(threadId, 20000).map(m => ({
        role: m.role,
        content: m.content
      }));

      // 5. Mode-Specific System Prompts
      const consultativeSystemPrompt = `You are a Senior Editor and Writing Consultant.
YOUR GOAL: Produce world-class, high-impact content.
CRITICAL BEHAVIOR:
1. INTERCEPT: If the user asks to "write" something vague, DO NOT generate.
2. CLARIFY: Ask 3-4 specific questions to define Tone, Audience, and Core Idea.
3. EXECUTE: Only generate content AFTER the user answers.`;

      let messages = [{ role: 'system', content: consultativeSystemPrompt }, ...history];

      // 6. Handle Search & Research Modes (Merged Logic)
      if (mode === 'research' || mode === 'search') {
        const searchModePrompt = mode === 'research' 
          ? 'You are now in RESEARCH mode. Provide a deep, structured analysis using the provided search context. Maintain your Senior Editor persona.' 
          : 'You are now in SEARCH mode. Focus on factual, up-to-date information from the provided search context. Maintain your Senior Editor persona.';
        
        // UI Feedback: "Thinking..." block
        const initText = mode === 'research' 
            ? '> [!NOTE]\n> **Initiating Research Phase...**\n> 1. Analyzing query scope...\n> 2. Identifying key domains...\n> 3. Synthesizing insights...\n\n---\n\n'
            : '> [!NOTE]\n> **Searching Web...**\n> Accessing Tavily Index...\n\n---\n\n';
        
        res.write(`data: ${JSON.stringify({ content: initText })}\n\n`);

        try {
          const searchResults = await SearchService.execute(message);
          
          messages.push({ 
            role: 'system', 
            content: `${searchModePrompt}\n\n${searchResults}` 
          });
        } catch (err) {
            console.error("Search Injection Failed:", err);
            // Don't crash stream, just notify
            messages.push({ role: 'system', content: `Search failed: ${err.message}` });
        }
      }

      // 7. Execute Stream
      const stream = await ChatService.generateStream(messages, { 
        model, 
        signal: abortController.signal // Pass abort signal to Ollama service
      });
      
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      
      let fullResponse = '';
      let buffer = '';
      let tokensUsed = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Robust Line Parsing (Handling chunks ending mid-line)
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const parsed = JSON.parse(line);
            
            // Handle Content
            if (parsed.message?.content) {
              fullResponse += parsed.message.content;
              res.write(`data: ${JSON.stringify({ content: parsed.message.content })}\n\n`);
            }

            // Handle Metadata (Final Packet)
            if (parsed.done) {
              tokensUsed = parsed.eval_count || 0;
              
              // 8. Persist Assistant Message with Metadata
              MemoryService.addMessage(
                uuidv4(), 
                threadId, 
                'assistant', 
                fullResponse,
                tokensUsed // Saving token count
              );
              
              res.write(`data: [DONE]\n\n`);
            }
          } catch (parseError) {
            console.warn('Skipping malformed JSON line:', line);
          }
        }
      }
      
      res.end();

      // Background Task: Auto-Title the Thread
      if (shouldAutoTitle) {
        const titlePrompt = [
          { role: 'system', content: 'You are a helpful assistant. Summarize the following message into a concise 3-5 word title. Do not use quotes.' },
          { role: 'user', content: message }
        ];

        ChatService.generateResponse(titlePrompt, model)
          .then(title => {
            if (title) {
              console.log(`Auto-titling thread ${threadId} to: ${title}`);
              MemoryService.updateThreadTitle(threadId, title);
            }
          })
          .catch(err => console.error('Auto-titling failed:', err));
      }

    } catch (error) {
      console.error('Stream Controller Error:', error);
      
      // If headers aren't sent, send JSON error. 
      // If streaming started, send SSE error event.
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message, type: 'error' })}\n\n`);
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
