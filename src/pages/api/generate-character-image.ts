import type { NextApiRequest, NextApiResponse } from 'next';
import { createCharacterImage } from '@/serverAction/openAI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const characterOptions = req.body;
      const imageUrl = await createCharacterImage(characterOptions);
      
      if (imageUrl) {
        res.status(200).json({ imageUrl });
      } else {
        res.status(500).json({ message: 'Failed to generate character image' });
      }
    } catch (error) {
      console.error('Error generating character image:', error);
      res.status(500).json({ message: 'Error generating character image' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
} 