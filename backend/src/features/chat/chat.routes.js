import express from 'express';
import { ChatController } from './chat.controller.js';

const router = express.Router();

router.post('/stream', ChatController.streamResponse);
router.get('/models', ChatController.listModels);

export default router;
