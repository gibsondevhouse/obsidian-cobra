# Obsidian Cobra

**Obsidian Cobra** is a flagship implementation of the **Agent Intelligence Framework**—a local-first, meticulously compartmentalized chat assistant designed for the MacBook M4. It features a premium glassmorphic UI and deep integration with Ollama for multi-mode (Chat, Search, Research) capabilities.

## Architecture

This project follows a strict **Meticulous Compartmentalized Feature-Based Structure**. Logic is isolated into single-responsibility modules to ensure architecture discipline and scalability.

### Backend Overview
The backend is built with Express and SQLite, featuring a pure entry point and vertical feature isolation:
- **`src/index.js`**: Clean entry point for routing and middleware.
- **`src/features/chat/`**: Interaction logic, including Ollama stream handling ([`chat.controller.js`](./backend/src/features/chat/chat.controller.js)).
- **`src/features/memory/`**: Persistence layer for threads and messages ([`memory.controller.js`](./backend/src/features/memory/memory.controller.js)).

### Frontend Overview
The frontend is a React application deconstructed into atomic components and custom hooks:
- **`src/features/chat/`**:
    - `hooks/useChatStream.js`: Encapsulated streaming and state logic.
    - `components/`: Logic-less presentation components (`MessageStream`, `ChatInput`, etc.).
    - `api/chat.api.js`: Centralized data fetching layer.

## Getting Started

### Prerequisites
- [Ollama](https://ollama.ai/) running with `gemma3:4b` installed.

### Installation
1. Start the services:
   ```bash
   ./scripts/start.sh
   ```

## Design Language
- **Tahoe Standards**: High-fidelity glassmorphism, blur effects, and superellipse UI.
- **ChatGPT Structural Patterns**: Content-first centered column for maximum readability.

---
*Built with precision following the Agent Intelligence Framework.*
