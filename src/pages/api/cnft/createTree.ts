import { cNftConfig } from "@/cnftConfig";
import { umi } from "@/utils/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const keyPair = umi.eddsa.createKeypairFromSecretKey(
        cNftConfig.walletKey
      );
      const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair);
      umi.use(signerIdentity(signer));
      const merkleTree = generateSigner(umi);
      const builder = await createTree(umi, {
        merkleTree,
        maxDepth: 14,
        maxBufferSize: 64,
      });
      await builder.sendAndConfirm(umi);
      res.status(200).json({ publicKey: merkleTree.publicKey });
    } catch (error) {
      console.error("Error Creating Tree", error);
      res.status(500).json({ message: "Error deducting credits" });
    }
  } else {
    res.status(405).end();
  }
}
