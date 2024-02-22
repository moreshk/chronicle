import { umi } from "@/utils/umi"
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi"
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchMerkleTree, mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import { decode, encode } from "bs58";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { walletAddress } = req.body;
        try {
            const keyPair = umi.eddsa.createKeypairFromSecretKey(decode(process.env.WALLET_PRIVATE_KEY!))
            const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
            umi.use(signerIdentity(signer))
            const merkleTreeAccount = await fetchMerkleTree(umi, publicKey(process.env.MERKLE_TREE!))

            const nftItemJsonObject = {
                symbol: process.env.COLLECTION_SYMBOL,
                name: process.env.COLLECTION_NAME!,
                description: process.env.COLLECTION_DESCRIPTION,
                seller_fee_basis_points: 5.5 * 100,
                image: 'https://nftstorage.link/ipfs/bafybeicvrfz5bpscllthtnagufy27wypnduwblprf5vtybtzkmpwn3ltgi',
                external_url: 'https://play.chronicle.quest/',
                attributes: [{
                    trait_type: 'Status',
                    value: 'CHRON ITEMS',
                },
                {
                    trait_type: 'Minted',
                    value: new Date().toISOString(),
                },],
                properties: {
                    category: 'image',
                    files: [
                        {
                            file: 'https://nftstorage.link/ipfs/bafybeicvrfz5bpscllthtnagufy27wypnduwblprf5vtybtzkmpwn3ltgi',
                            type: 'image/png',
                        },
                    ],
                    creators: keyPair.publicKey,
                },
            }
            const nftItemJsonUri = await umi.uploader.uploadJson(nftItemJsonObject)
            const mint = await mintToCollectionV1(umi, {
                leafOwner: publicKey(walletAddress),
                merkleTree: merkleTreeAccount.publicKey,
                collectionMint: publicKey(process.env.NEXT_PUBLIC_COLLECTION_ADDRESS!),
                metadata: {
                    name: "Chronicle Item",
                    uri: nftItemJsonUri,
                    sellerFeeBasisPoints: 5.5 * 100,
                    collection: { key: publicKey(process.env.NEXT_PUBLIC_COLLECTION_ADDRESS!), verified: false },
                    creators: [{
                        "address": keyPair.publicKey,
                        "verified": false,
                        "share": 100
                    }],
                },
            }).sendAndConfirm(umi)
            res.status(200).json({ publicKey: encode(mint.signature) });
        } catch (error) {
            console.error("Error Minting NFt", error);
            res.status(500).json({ message: "Error deducting credits" });
        }
    } else {
        res.status(405).end();
    }
}
