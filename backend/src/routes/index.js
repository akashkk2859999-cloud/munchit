import express from 'express';
import quizRoutes from './quizRoutes.js';

const router = express.Router();

router.use('/quiz', quizRoutes);

export default router;
