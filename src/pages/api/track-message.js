import { insertChatHistory } from '../../data/db'; // Adjust the import path as needed
// import { hasEnoughCredits } from '@/data/db';
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nft_id, wallet_address, message_sent, response_received } = req.body;
    try {
      await insertChatHistory(nft_id, wallet_address, message_sent, response_received);
      res.status(200).json({ message: 'Chat history recorded successfully' });
    } catch (error) {
      console.error('Error inserting chat history record', error);
      res.status(500).json({ error: 'Failed to record chat history' });
    }
  } else {
    // If not a POST request, send 405 - Method Not Allowed
    res.status(405).end();
  }
}

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//       const { nftAddress } = req.body;
//       try {
//         const enoughCredits = await hasEnoughCredits(nftAddress);
//         res.status(200).json({ enoughCredits });
//       } catch (error) {
//         console.error('Error checking credits', error);
//         res.status(500).json({ message: 'Error checking credits' });
//       }
//     } else {
//       res.status(405).end(); // Method Not Allowed
//     }
//   }