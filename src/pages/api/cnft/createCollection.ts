import { cNftConfig } from "@/cnftConfig"
import { umi } from "@/utils/umi"
import { createGenericFile, createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi"
import { promises as fs } from 'fs';
import { createNft } from "@metaplex-foundation/mpl-token-metadata"
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const keyPair = umi.eddsa.createKeypairFromSecretKey(cNftConfig.walletKey)
      const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
      umi.use(signerIdentity(signer))
      const collectionImageBuffer = await fs.readFile(process.cwd() + '/public/master.png')
      const collectionImageGenericFile = createGenericFile(
        collectionImageBuffer,
        'public/master.png'
      )
      const [collectionImageUri] = await umi.uploader.upload([
        collectionImageGenericFile,
      ])
      const collectionObject = {
        name: cNftConfig.COLLECTION_SYMBOL,
        symbol: cNftConfig.COLLECTION_SYMBOL,
        description: 'test description',
        seller_fee_basis_points: 5.5 * 100,
        image: collectionImageUri,
        external_url: 'https://chronicle.quest/',
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
        symbol: cNftConfig.COLLECTION_SYMBOL,
        name: cNftConfig.COLLECTION_NAME,
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
