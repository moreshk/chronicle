// src/pages/api/get-silver-balance.js

import { getSilverBalance } from '../../data/db'; // Adjust the import path as needed

// Make sure to export default an async function for the API route
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nftAddress, walletAddress } = req.body;
    try {
      const result = await getSilverBalance(nftAddress, walletAddress);
      res.status(200).json({ 
        silver: result.silver,
        lastClaimed: result.lastClaimed
      });
    } catch (error) {
      console.error('Error fetching silver balance', error);
      res.status(500).json({ error: 'Failed to fetch silver balance' });
    }
  } else {
    // If not a POST request, send 405 - Method Not Allowed
    res.status(405).end();
  }
}