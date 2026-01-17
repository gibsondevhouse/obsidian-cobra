import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // We separate logical buckets for clearer UI, but flattened for search
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper: Read file content
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name: file.name,
          path: file.webkitRelativePath || file.name, // Preserves folder structure
          content: e.target.result,
          type: 'file'
        });
      };
      reader.readAsText(file);
    });
  };

  const addFolder = async (fileList) => {
    setIsProcessing(true);
    const newFiles = Array.from(fileList);
    
    // Group by top-level directory name to count "folders"
    const folderName = newFiles[0]?.webkitRelativePath.split('/')[0];
    if (!folderName) return setIsProcessing(false);

    const processedFiles = await Promise.all(newFiles.map(readFile));
    
    setFolders(prev => [...prev, { 
      id: Date.now(), 
      name: folderName, 
      files: processedFiles 
    }]);
    setIsProcessing(false);
  };

  const addIndividualFiles = async (fileList) => {
    setIsProcessing(true);
    const processed = await Promise.all(Array.from(fileList).map(readFile));
    setFiles(prev => [...prev, ...processed]);
    setIsProcessing(false);
  };

  // The AI "Tool": Recursive Search
  // Returns a formatted string of relevant code to inject into the prompt
  const searchContext = useCallback((query) => {
    if (!query) return '';

    const lowerQuery = query.toLowerCase();
    let hits = [];

    // 1. Search Individual Files
    files.forEach(f => {
      if (f.name.toLowerCase().includes(lowerQuery) || f.content.toLowerCase().includes(lowerQuery)) {
        hits.push(`File: ${f.name}\nContent:\n${f.content}`);
      }
    });

    // 2. Recursive Search in Folders
    folders.forEach(folder => {
      folder.files.forEach(f => {
        // Matches path (recursive) or content
        if (f.path.toLowerCase().includes(lowerQuery) || f.content.toLowerCase().includes(lowerQuery)) {
          hits.push(`Path: ${f.path}\nContent:\n${f.content}`);
        }
      });
    });

    return hits.join('\n\n---\n\n');
  }, [folders, files]);

  const clearAll = () => {
    setFolders([]);
    setFiles([]);
  };

  return (
    <ChatContext.Provider value={{ 
      folders, 
      files, 
      addFolder, 
      addIndividualFiles, 
      searchContext,
      clearAll,
      isProcessing
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
