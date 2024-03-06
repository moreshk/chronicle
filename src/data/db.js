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
  } catch (err) {
    console.error("Error inserting chat history record", err.stack);
  }
}


//Insert into the Quest History Table
async function insertQuestHistory(
  nft_id,
  wallet_address,
  message_sent,
  response_received
) {
  const insertText = `
    INSERT INTO quest_history (nft_id, wallet_address, message_sent, response_received)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await pool.query(insertText, [
      nft_id,
      wallet_address,
      message_sent,
      response_received,
    ]);
  } catch (err) {
    console.error("Error inserting quest history record", err.stack);
  }
}


const defaultCredits = process.env.DEFAULT_CREDITS || 20; // Fallback to 10 if the environment variable is not set
const resetCreditsMinutes =
  parseInt(process.env.NEXT_PUBLIC_RESET_CREDITS_MINUTES, 10) || 15; // Fallback to 5 if the environment variable is not set

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
  return rowCount > 0; // Returns true if the update was successful, false otherwise
}

async function getCreditsForNFT(nftAddress) {
  await ensureCreditsForNFT(nftAddress);
  const selectText =
    "SELECT credits, last_updated FROM nft_credits WHERE nft_address = $1";
  try {
    const { rows } = await pool.query(selectText, [nftAddress]);
    if (rows.length) {
      return { credits: rows[0].credits, lastUpdated: rows[0].last_updated };
    } else {
      const currentTime = new Date();
      const insertText =
        "INSERT INTO nft_credits (nft_address, credits, last_updated) VALUES ($1, $2, $3)";
      await pool.query(insertText, [nftAddress, defaultCredits, currentTime]);
      const { rows } = await pool.query(selectText, [nftAddress]);
      return { credits: rows[0].credits, lastUpdated: rows[0].last_updated };
    }
  } catch (err) {
    console.error("Error in getCreditsForNFT", err);
    return { credits: 0, lastUpdated: undefined };
  }
}

// Multipliers for species and class
const speciesMultipliers = {
  Human: 1,
  Elf: 1.1,
  Dwarf: 1.2,
  Halfling: 1.1,
  Dragonborn: 1,
  Gnome: 1.1,
  'Half-Elf': 1,
  'Half-Orc': 0.8,
  Tiefling: 0.8,
};

const classMultipliers = {
  Acolyte: 0.8,
  Charlatan: 1.5,
  'Criminal/Spy': 1.3,
  Entertainer: 1.2,
  'Folk Hero': 1,
  'Guild Artisan': 1.2,
  Hermit: 0.7,
  Noble: 1.5,
  Outlander: 1,
  Sage: 1.1,
  'Sailor/Pirate': 1,
  Soldier: 1.1,
  Urchin: 0.8,
};

const silverClaimCooldown = parseInt(process.env.NEXT_PUBLIC_SILVER_CLAIM_COOLDOWN_MINUTES, 10) || 1440; // Fallback to 1440 minutes (24 hours) if the environment variable is not set
const silverIncrementAmount = parseInt(process.env.SILVER_INCREMENT_AMOUNT, 10) || 10; // Fallback to 10 if the environment variable is not set

async function claimSilver(nftAddress, walletAddress, species, background) {
  const speciesMultiplier = speciesMultipliers[species] || 1;
  const classMultiplier = classMultipliers[background] || 1;

  const totalMultiplier = speciesMultiplier * classMultiplier;

  const currentTime = new Date();
  const selectText = `
    SELECT silver, last_claimed FROM silver_claims WHERE nft_address = $1 AND wallet_address = $2
  `;
  const { rows } = await pool.query(selectText, [nftAddress, walletAddress]);

  if (rows.length === 0) {
    const initialSilver = parseFloat((silverIncrementAmount * totalMultiplier).toFixed(2));
    const insertText = `
      INSERT INTO silver_claims (nft_address, wallet_address, silver, last_claimed)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(insertText, [nftAddress, walletAddress, initialSilver, currentTime]);
    return { silver: initialSilver, lastClaimed: currentTime };
  } else {
    const lastClaimed = new Date(rows[0].last_claimed);
    const minutesDiff = (currentTime - lastClaimed) / (1000 * 60);
    if (minutesDiff >= silverClaimCooldown) {
      const currentSilver = parseFloat(rows[0].silver);
      const incrementSilver = parseFloat((silverIncrementAmount * totalMultiplier).toFixed(2));
      const newSilver = parseFloat((currentSilver + incrementSilver).toFixed(2));
      const updateText = `
        UPDATE silver_claims SET silver = $3, last_claimed = $4
        WHERE nft_address = $1 AND wallet_address = $2
      `;
      await pool.query(updateText, [nftAddress, walletAddress, newSilver, currentTime]);
      return { silver: newSilver, lastClaimed: currentTime };
    } else {
      return { silver: rows[0].silver, lastClaimed: rows[0].last_claimed };
    }
  }
}

// Add this new function in db.js
async function getSilverBalance(nftAddress, walletAddress) {
  const selectText = `
    SELECT silver, last_claimed FROM silver_claims WHERE nft_address = $1 AND wallet_address = $2
  `;
  try {
    const { rows } = await pool.query(selectText, [nftAddress, walletAddress]);
    if (rows.length > 0) {
      return { silver: rows[0].silver, lastClaimed: rows[0].last_claimed };
    } else {
      // If no record exists, return a default value for silver and last_claimed
      return { silver: 0, lastClaimed: null };
    }
  } catch (err) {
    console.error("Error fetching silver balance", err.stack);
    throw err;
  }
}

// Add this function in db.js
async function deductSilver(nftAddress, walletAddress, amount) {
  // Start a transaction
  await pool.query('BEGIN');

  const selectText = `
    SELECT silver FROM silver_claims WHERE nft_address = $1 AND wallet_address = $2 FOR UPDATE;
  `;
  const { rows: selectRows } = await pool.query(selectText, [nftAddress, walletAddress]);

  let updateResult;
  if (selectRows.length > 0) {
    // If a record exists, update it
    const updateText = `
      UPDATE silver_claims
      SET silver = silver - $3
      WHERE nft_address = $1 AND wallet_address = $2
      RETURNING silver;
    `;
    updateResult = await pool.query(updateText, [nftAddress, walletAddress, amount]);
  } else {
    // If no record exists, insert a new one with negative silver amount
    const insertText = `
      INSERT INTO silver_claims (nft_address, wallet_address, silver, last_claimed)
      VALUES ($1, $2, -$3::numeric, NOW())
      RETURNING silver;
    `;
    updateResult = await pool.query(insertText, [nftAddress, walletAddress, amount]);
  }

  // Commit the transaction
  await pool.query('COMMIT');

  return updateResult.rows.length > 0; // Returns true if the update or insert was successful, false otherwise
}


async function upsertHeroJourney(nft_id, story) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const selectQuery = 'SELECT id FROM hero_journey WHERE nft_id = $1';
    const selectResult = await client.query(selectQuery, [nft_id]);

    if (selectResult.rows.length === 0) {
      // No existing record, insert a new one
      const insertQuery = `
        INSERT INTO hero_journey (nft_id, story_so_far)
        VALUES ($1, $2)
      `;
      await client.query(insertQuery, [nft_id, story]);
    } else {
      // Existing record found, update it
      const updateQuery = `
        UPDATE hero_journey
        SET story_so_far = $2, timestamp = CURRENT_TIMESTAMP
        WHERE nft_id = $1
      `;
      await client.query(updateQuery, [nft_id, story]);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in upsertHeroJourney', err.stack);
    throw err; // Rethrow the error for further handling if necessary
  } finally {
    client.release();
  }
}

async function getHeroJourneyByNFTId(nft_id) {
  const selectQuery = 'SELECT story_so_far FROM hero_journey WHERE nft_id = $1';
  try {
    const { rows } = await pool.query(selectQuery, [nft_id]);
    if (rows.length > 0) {
      return rows[0].story_so_far; // Return the story if found
    } else {
      return null; // Return null if no story is found for the given nft_id
    }
  } catch (err) {
    console.error('Error fetching hero journey', err.stack);
    throw err; // Rethrow the error for further handling if necessary
  }
}

module.exports = {
  insertChatHistory,
  insertQuestHistory,
  ensureCreditsForNFT,
  hasEnoughCredits,
  deductCredits,
  getCreditsForNFT,
  resetCreditsMinutes,
  claimSilver,
  getSilverBalance,
  deductSilver,
  upsertHeroJourney,
  getHeroJourneyByNFTId,
};
