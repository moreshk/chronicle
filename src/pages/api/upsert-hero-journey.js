// src/pages/api/upsert-hero-journey.js
import { upsertHeroJourney } from '../../data/db'; // Adjust the import path as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nft_id, story } = req.body;

    if (!nft_id || !story) {
      return res.status(400).json({ error: 'Missing nft_id or story parameter' });
    }

    try {
      await upsertHeroJourney(nft_id, story);
      res.status(200).json({ message: 'Hero journey updated successfully' });
    } catch (error) {
      console.error('Error in upsertHeroJourney API', error);
      res.status(500).json({ error: 'Failed to update hero journey' });
    }
  } else {
    // If not a POST request, send 405 - Method Not Allowed
    res.status(405).end();
  }
}