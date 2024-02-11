import { insertChatHistory } from '../../data/db'; // Adjust the import path as needed

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