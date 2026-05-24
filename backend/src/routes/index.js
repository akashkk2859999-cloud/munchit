import express from 'express';
import quizRoutes from './quizRoutes.js';
import otpRoutes from './otpRoutes.js';

const router = express.Router();

router.use('/quiz', quizRoutes);
router.use('/otp', otpRoutes);

export default router;
