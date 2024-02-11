import { hasEnoughCredits } from '@/data/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nftAddress } = req.body;
    try {
      const enoughCredits = await hasEnoughCredits(nftAddress);
      res.status(200).json({ enoughCredits });
    } catch (error) {
      console.error('Error checking credits', error);
      res.status(500).json({ message: 'Error checking credits' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}