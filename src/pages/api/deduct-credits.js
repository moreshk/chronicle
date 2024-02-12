import { deductCredits } from '../../data/db'; // Adjust the import path as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nftAddress } = req.body;
    try {
      const success = await deductCredits(nftAddress);
      if (success) {
        res.status(200).json({ message: 'Credit deducted successfully' });
      } else {
        res.status(409).json({ message: 'No credits to deduct or NFT address not found' });
      }
    } catch (error) {
      console.error('Error deducting credits', error);
      res.status(500).json({ message: 'Error deducting credits' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}