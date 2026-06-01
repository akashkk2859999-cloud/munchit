import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';
import db from './config/db.js'; // Ensure database pool is initialized
import { downloadTemplates } from './utility/downloadTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());

// API Routes (supports both direct access and corporate subpath proxying under /backend)
app.use(['/api', '/backend/api'], apiRoutes);

// Catch-all for unmatched API routes to prevent them from falling through to the frontend
app.use(['/api', '/backend/api'], (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Serve static files from the React frontend build directory
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Serve static directories for uploaded faces, swapped results, and templates
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/results', express.static(path.join(__dirname, '../results')));
app.use('/templates', express.static(path.join(__dirname, '../templates')));

// Health check endpoints
app.get('/backend', (req, res) => {
  res.json({ status: 'online', message: 'MunchIt API is running' });
});

// Production Diagnostics Endpoint
import { exec } from 'child_process';
app.get(['/api/diagnostics', '/backend/api/diagnostics'], (req, res) => {
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

// Catch-all for React SPA routing - serves index.html for any unmatched non-API requests
app.use((req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Frontend build not found. Please build the frontend first.' });
    }
  });
});

// Error boundary middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Dynamically sync templates and models from Azure Storage on launch
  await downloadTemplates();
});
