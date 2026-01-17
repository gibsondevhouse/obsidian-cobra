import fetch from 'node-fetch';

export const SearchService = {
  /**
   * Executes a search query using the Tavily API.
   * @param {string} query - The user's search query.
   * @returns {Promise<string>} - Formatted search results for the LLM.
   */
  execute: async (query) => {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      console.warn('SearchService: No TAVILY_API_KEY found in environment variables.');
      return "SYSTEM NOTE: Search capability is currently disabled because the API key is missing. Please inform the user they need to set TAVILY_API_KEY in the backend .env file.";
    }

    try {
      console.log(`SearchService: Searching for "${query}"...`);
      
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: "basic",
          include_answer: true,
          max_results: 5
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // maximize content density for the LLM
      let formattedResults = `SEARCH CONTEXT FOR: "${query}"\n\n`;
      
      if (data.answer) {
        formattedResults += `> DIRECT ANSWER: ${data.answer}\n\n`;
      }

      if (data.results && data.results.length > 0) {
        data.results.forEach((result, index) => {
          formattedResults += `[${index + 1}] ${result.title}\n`;
          formattedResults += `    URL: ${result.url}\n`;
          formattedResults += `    CONTENT: ${result.content}\n\n`;
        });
      } else {
        formattedResults += "No relevant search results found.\n";
      }

      return formattedResults;

    } catch (error) {
      console.error('SearchService Error:', error);
      return `SYSTEM ERROR: Failed to perform search. Error: ${error.message}`;
    }
  }
};
