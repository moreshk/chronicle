// src/pages/api/get-hero-journey.js
import { getHeroJourneyByNFTId } from '../../data/db'; // Adjust the import path as needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { nft_id } = req.query;

    if (!nft_id) {
      return res.status(400).json({ error: 'Missing nft_id parameter' });
    }

    try {
      const story = await getHeroJourneyByNFTId(nft_id);
      if (story) {
        res.status(200).json({ story });
      } else {
        res.status(404).json({ error: 'No hero journey found for the given NFT ID' });
      }
    } catch (error) {
      console.error('Error in getHeroJourney API', error);
      res.status(500).json({ error: 'Failed to retrieve hero journey' });
    }
  } else {
    // If not a GET request, send 405 - Method Not Allowed
    res.status(405).end();
  }
}