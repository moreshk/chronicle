import { umi } from "@/utils/umi"
import { createGenericFile, createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi"
import { promises as fs } from 'fs';
import { createNft } from "@metaplex-foundation/mpl-token-metadata"
import { NextApiRequest, NextApiResponse } from 'next';
import { decode } from "bs58";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const keyPair = umi.eddsa.createKeypairFromSecretKey(decode(process.env.WALLET_PRIVATE_KEY!))
      const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
      umi.use(signerIdentity(signer))
      const collectionImageBuffer = await fs.readFile(process.cwd() + '/public/chron.png')
      const collectionImageGenericFile = createGenericFile(
        collectionImageBuffer,
        'chron.png'
      )
      const [collectionImageUri] = await umi.uploader.upload([
        collectionImageGenericFile,
      ])

      const collectionObject = {
        name: process.env.COLLECTION_NAME,
        symbol: process.env.COLLECTION_SYMBOL,
        description: process.env.COLLECTION_DESCRIPTION,
        seller_fee_basis_points: 5.5 * 100,
        image: collectionImageUri,
        external_url: 'https://play.chronicle.quest/',
        properties: {
          category: 'image',
          files: [
            {
              file: collectionImageUri,
              type: 'image/png',
            },
          ],
        },
      }
      const collectionJsonUri = await umi.uploader.uploadJson(collectionObject)
      const collectionMint = generateSigner(umi)
      await createNft(umi, {
        mint: collectionMint,
        symbol: process.env.COLLECTION_SYMBOL,
        name: process.env.COLLECTION_NAME!,
        uri: collectionJsonUri,
        sellerFeeBasisPoints: percentAmount(5.5),
        isCollection: true,
      }).sendAndConfirm(umi)
      res.status(200).json({ publicKey: collectionMint.publicKey });
    } catch (error) {
      console.error("Error Creating Collection", error);
      res.status(500).json({ message: "Error deducting credits" });
    }
  } else {
    res.status(405).end();
  }
}
