const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Test the connection when the server starts
pool.connect()
  .then(() => console.log('🔗 Connected to PostgreSQL Database!'))
  .catch(err => console.error('🚨 Database connection error:', err.stack));

module.exports = pool;