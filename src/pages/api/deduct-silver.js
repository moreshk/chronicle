// src/pages/api/deduct-silver.js
import { deductSilver } from '../../data/db'; // Adjust the import path as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nftAddress, walletAddress, amount } = req.body;
    try {
      const success = await deductSilver(nftAddress, walletAddress, amount);
      if (success) {
        res.status(200).json({ message: 'Silver deducted successfully' });
      } else {
        res.status(400).json({ error: 'Not enough silver to deduct' });
      }
    } catch (error) {
      console.error('Error deducting silver', error);
      res.status(500).json({ error: 'Failed to deduct silver' });
    }
  } else {
    // If not a POST request, send 405 - Method Not Allowed
    res.status(405).end();
  }
}