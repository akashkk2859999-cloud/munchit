import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';
import db from './config/db.js'; // Ensure database pool is initialized

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoints
app.get(['/', '/backend'], (req, res) => {
  res.json({ status: 'online', message: 'MunchIt API is running' });
});

// Catch-all for unmatched routes (returns a clean 404 instead of throwing ENOENT)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error boundary middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
