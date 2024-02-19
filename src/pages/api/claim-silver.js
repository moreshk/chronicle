// src/pages/api/claim-silver.js
import { claimSilver } from '../../data/db'; // Adjust the import path as needed

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nftAddress, walletAddress, species, background } = req.body;
        try {
            const result = await claimSilver(nftAddress, walletAddress, species, background);
            res.status(200).json({ 
                message: 'Silver claimed successfully',
                silver: result.silver,
                lastClaimed: result.lastClaimed
            });
        } catch (error) {
            console.error('Error claiming silver', error);
            res.status(500).json({ error: 'Failed to claim silver' });
        }
    } else {
        // If not a POST request, send 405 - Method Not Allowed
        res.status(405).end();
    }
}