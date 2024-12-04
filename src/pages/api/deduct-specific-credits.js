import { deductSpecificCredits } from '../../data/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nftAddress, creditsToDeduct } = req.body;

    // Validate input
    if (!nftAddress || typeof creditsToDeduct !== 'number' || creditsToDeduct <= 0) {
      return res.status(400).json({ message: 'Invalid input. Please provide a valid nftAddress and a positive number of credits to deduct.' });
    }

    try {
      const success = await deductSpecificCredits(nftAddress, creditsToDeduct);
      if (success) {
        res.status(200).json({ message: `${creditsToDeduct} credit(s) deducted successfully` });
      } else {
        res.status(409).json({ message: 'Not enough credits to deduct or NFT address not found' });
      }
    } catch (error) {
      console.error('Error deducting specific credits', error);
      res.status(500).json({ message: 'Error deducting credits' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
} 