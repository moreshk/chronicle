import { increaseCredits } from '../../data/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nftAddress, amount } = req.body;
    try {
      const success = await increaseCredits(nftAddress, amount);
      if (success) {
        res.status(200).json({ message: 'Credits increased successfully' });
      } else {
        res.status(404).json({ message: 'NFT address not found' });
      }
    } catch (error) {
      console.error('Error increasing credits', error);
      res.status(500).json({ message: 'Error increasing credits' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
