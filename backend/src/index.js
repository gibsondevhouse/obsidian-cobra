import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import memoryRoutes from './features/memory/memory.routes.js';
import chatRoutes from './features/chat/chat.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1', memoryRoutes);
app.use('/api/v1/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Obsidian Cobra Backend running on port ${PORT}`);
});
