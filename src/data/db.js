require("dotenv").config();
// const { Pool } = require('pg');

// Convert the environment variable to a boolean. Default to true if not provided.
const { Pool } = require("pg");

const rejectUnauthorized = process.env.DB_REJECT_UNAUTHORIZED !== "false";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: rejectUnauthorized, // This should be true for production
  },
});

async function insertChatHistory(
  nft_id,
  wallet_address,
  message_sent,
  response_received
) {
  const insertText = `
    INSERT INTO chat_history (nft_id, wallet_address, message_sent, response_received)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await pool.query(insertText, [
      nft_id,
      wallet_address,
      message_sent,
      response_received,
    ]);
    console.log("Chat history record inserted successfully");
  } catch (err) {
    console.error("Error inserting chat history record", err.stack);
  }
}

const defaultCredits = process.env.DEFAULT_CREDITS || 20; // Fallback to 10 if the environment variable is not set
const resetCreditsMinutes =
  parseInt(process.env.RESET_CREDITS_MINUTES, 10) || 15; // Fallback to 5 if the environment variable is not set

// Add this new function in db.js
async function ensureCreditsForNFT(nftAddress) {
  const selectText =
    "SELECT credits, last_updated FROM nft_credits WHERE nft_address = $1";
  const { rows } = await pool.query(selectText, [nftAddress]);
  const currentTime = new Date();

  if (rows.length === 0) {
    // No record found for the NFT address, insert a new record with 10 credits
    const insertText =
      "INSERT INTO nft_credits (nft_address, credits, last_updated) VALUES ($1, $2, $3)";
    await pool.query(insertText, [nftAddress, defaultCredits, currentTime]);
    return true;
  } else {
    const lastUpdated = new Date(rows[0].last_updated);
    const minutesDiff = (currentTime - lastUpdated) / (1000 * 60);
    if (minutesDiff >= resetCreditsMinutes) {
      // It's been more than 24 hours since the last update, reset credits to 50
      const updateText =
        "UPDATE nft_credits SET credits = $2, last_updated = $3 WHERE nft_address = $1";
      await pool.query(updateText, [nftAddress, defaultCredits, currentTime]);
      return true;
    }

    return rows[0].credits > 0;
  }
}

// Modify the hasEnoughCredits function to use the new ensureCreditsForNFT function
async function hasEnoughCredits(nftAddress) {
  const hasCredits = await ensureCreditsForNFT(nftAddress);
  return hasCredits;
}

async function deductCredits(nftAddress) {
  const updateText =
    "UPDATE nft_credits SET credits = credits - 1 WHERE nft_address = $1 AND credits > 0";
  const { rowCount } = await pool.query(updateText, [nftAddress]);
  console.log("🚀 ~ deductCredits ~ rowCount:", rowCount);
  return rowCount > 0; // Returns true if the update was successful, false otherwise
}

async function getCreditsForNFT(nftAddress) {
  const selectText = "SELECT credits FROM nft_credits WHERE nft_address = $1";
  try {
    const { rows } = await pool.query(selectText, [nftAddress]);
    if (rows.length) {
      return rows[0].credits;
    } else {
      const currentTime = new Date();
      const insertText =
        "INSERT INTO nft_credits (nft_address, credits, last_updated) VALUES ($1, $2, $3)";
      await pool.query(insertText, [nftAddress, defaultCredits, currentTime]);
      const { rows } = await pool.query(selectText, [nftAddress]);
      return rows[0].credits;
    }
  } catch (err) {
    console.error("Error in getCreditsForNFT", err);
    return 0;
  }
}

module.exports = {
  insertChatHistory,
  ensureCreditsForNFT,
  hasEnoughCredits,
  deductCredits,
  getCreditsForNFT,
};
