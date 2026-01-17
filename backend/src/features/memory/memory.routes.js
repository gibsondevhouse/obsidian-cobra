import express from 'express';
import { MemoryController } from './memory.controller.js';

const router = express.Router();

router.get('/threads', MemoryController.getThreads);
router.post('/threads', MemoryController.createThread);
router.get('/threads/:id', MemoryController.getThread);
router.delete('/threads/:id', MemoryController.deleteThread); // Added
router.get('/threads/:id/messages', MemoryController.getMessages);

export default router;
