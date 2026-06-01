import express from 'express';
import quizRoutes from './quizRoutes.js';
import otpRoutes from './otpRoutes.js';
import faceSwapRoutes from './faceSwapRoutes.js';

import { exec } from 'child_process';

const router = express.Router();

router.use('/quiz', quizRoutes);
router.use('/otp', otpRoutes);
router.use('/face-swap', faceSwapRoutes);

router.get('/diagnostics', (req, res) => {
  exec('python3 --version || python --version || py --version', (pythonErr, pythonStdout, pythonStderr) => {
    const pythonVersion = pythonStdout || pythonStderr || 'none';
    exec('which python3 || which python || which py || whereis python', (pathErr, pathStdout, pathStderr) => {
      const pythonPath = pathStdout || pathStderr || 'none';
      exec('pip3 list || pip list', (pipErr, pipStdout, pipStderr) => {
        const pipList = pipStdout || pipStderr || 'none';
        res.json({
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
          pythonVersion: pythonVersion.trim(),
          pythonPath: pythonPath.trim(),
          pipList: pipList.substring(0, 1000)
        });
      });
    });
  });
});

export default router;
