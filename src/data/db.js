require('dotenv').config();
// const { Pool } = require('pg');

// Convert the environment variable to a boolean. Default to true if not provided.
const { Pool } = require('pg');

const rejectUnauthorized = process.env.DB_REJECT_UNAUTHORIZED !== 'false';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: rejectUnauthorized // This should be true for production
  },
});

async function insertChatHistory(nft_id, wallet_address, message_sent, response_received) {
  const insertText = `
    INSERT INTO chat_history (nft_id, wallet_address, message_sent, response_received)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await pool.query(insertText, [nft_id, wallet_address, message_sent, response_received]);
    console.log('Chat history record inserted successfully');
  } catch (err) {
    console.error('Error inserting chat history record', err.stack);
  }
}

module.exports = {
  insertChatHistory,
};