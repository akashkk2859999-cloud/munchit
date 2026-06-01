import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * PostgreSQL Connection Pool for Azure Database
 * Uses SSL for secure Azure connections
 */
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Log connection events
pool.on('connect', () => {
  console.log('✅ Connected to Azure PostgreSQL database (MunchIt)');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Execute a parameterized query against the database.
 * @param {string} text - SQL query string with $1, $2, ... placeholders
 * @param {Array} params - Query parameter values
 * @returns {Promise<import('pg').QueryResult>}
 */
export const dbQuery = async (text, params = []) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log(`[DB] Executed query (${duration}ms) — rows: ${result.rowCount}`);
  return result;
};

/**
 * Initialize database tables
 */
async function initializeDatabase() {
  try {
    // Create Quiz Submissions Table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id SERIAL PRIMARY KEY,
        answers JSONB NOT NULL,
        primary_personality TEXT NOT NULL,
        secondary_personality TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    
    // Dynamically alter the table to add registration info if they don't exist
    await dbQuery(`
      ALTER TABLE quiz_submissions 
      ADD COLUMN IF NOT EXISTS name TEXT,
      ADD COLUMN IF NOT EXISTS phone_number TEXT,
      ADD COLUMN IF NOT EXISTS swapped_image TEXT
    `);
    
    console.log('✅ Database tables initialized (MunchIt)');
  } catch (error) {
    console.error('❌ Database migration error:', error.message);
  }
}

// Run initialization on import
initializeDatabase();

export default pool;
