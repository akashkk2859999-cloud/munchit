import express from 'express';
import quizRoutes from './quizRoutes.js';
import otpRoutes from './otpRoutes.js';
import faceSwapRoutes from './faceSwapRoutes.js';

const router = express.Router();

router.use('/quiz', quizRoutes);
router.use('/otp', otpRoutes);
router.use('/face-swap', faceSwapRoutes);

export default router;
