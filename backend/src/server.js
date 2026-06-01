import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';
import db from './config/db.js'; // Ensure database pool is initialized
import { downloadTemplates } from './utility/downloadTemplates.js';

// Export system readiness state (ESM live binding)
export let isSystemReady = false;

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

// Health check endpoints (supports Kubernetes readiness probes)
app.get('/backend', (req, res) => {
  if (!isSystemReady) {
    return res.status(503).json({ 
      status: 'initializing', 
      message: 'MunchIt API is starting up. Synchronizing campaign templates and ML models from Azure Blob Storage...' 
    });
  }
  res.json({ status: 'online', message: 'MunchIt API is running and fully initialized' });
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
  
  // Dynamically sync templates and models from Azure Storage on launch (Non-blocking to Express startup)
  try {
    console.log('🔄 Initiating dynamic templates/models sync on launch...');
    await downloadTemplates();
    isSystemReady = true;
    console.log('🚀 MunchIt Backend is fully ready to handle face swap requests!');
  } catch (err) {
    console.error('❌ Failed to run template/model synchronizer on launch:', err.message);
    // Fall back to ready state so local developers without Azure credentials are not blocked
    isSystemReady = true;
  }
});
