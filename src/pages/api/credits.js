import { getCreditsForNFT } from "../../data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { nftAddress } = req.body;
    try {
      const credits = await getCreditsForNFT(nftAddress);
      res.status(200).json({ credits });
    } catch (error) {
      console.error("Error deducting credits", error);
      res.status(500).json({ message: "Error deducting credits" });
    }
  } else {
    res.status(405).end();
  }
}
