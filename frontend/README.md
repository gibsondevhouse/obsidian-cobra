# Obsidian Cobra - Frontend

This is the React-based frontend for the Obsidian Cobra assistant, following the **Agent Intelligence Framework** standards.

## Project Structure

The frontend is organized by features to ensure meticulous compartmentalization.

- **`src/features/chat/`**: Central feature for chat interaction.
    - **`api/`**: Axios service for chat and thread endpoints.
    - **`components/`**: Atomic UI parts (`ChatHeader`, `MessageStream`, `MessageItem`, `ChatInput`).
    - **`hooks/`**: `useChatStream.js` (State and Ollama streaming logic).
- **`src/components/`**: Shared UI layout components (`Sidebar`, `Layout`).
- **`src/styles/`**: Global `design-system.css` containing the luxury glassmorphism tokens.

## Development

```bash
npm run dev
```

## Styling
- Built with **Vanilla CSS** for maximum control.
- Uses **Framer Motion** for micro-animations.
- Icons provided by **Lucide React**.
