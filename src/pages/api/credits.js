import { getCreditsForNFT } from "../../data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { nftAddress } = req.body;
    try {
      const details = await getCreditsForNFT(nftAddress);
      console.log("🚀 ~ handler ~ details:", details);
      res.status(200).json(details);
    } catch (error) {
      console.error("Error deducting credits", error);
      res.status(500).json({ message: "Error deducting credits" });
    }
  } else {
    res.status(405).end();
  }
}
