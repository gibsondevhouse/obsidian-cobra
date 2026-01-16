import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gemma3:4b';

export const ChatService = {
  async generateStream(messages, options = {}) {
    const { model = DEFAULT_MODEL, stream = true } = options;
    
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama Error: ${response.statusText}`);
      }

      return response.body;
    } catch (error) {
      console.error('ChatService generateStream error:', error);
      throw error;
    }
  },

  async listModels() {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error listing models:', error);
      return [];
    }
  }
};
