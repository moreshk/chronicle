import { cNftConfig } from "@/cnftConfig"
import { umi } from "@/utils/umi"
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi"
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchMerkleTree, mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import { encode } from "bs58";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { walletAddress } = req.body;
        try {
            const keyPair = umi.eddsa.createKeypairFromSecretKey(cNftConfig.walletKey)
            const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
            umi.use(signerIdentity(signer))

            const merkleTreeAccount = await fetchMerkleTree(umi, cNftConfig.merkleTree)

            const nftItemJsonObject = {
                name: cNftConfig.COLLECTION_NAME,
                symbol: cNftConfig.COLLECTION_SYMBOL,
                description: cNftConfig.COLLECTION_DESCRIPTION,
                seller_fee_basis_points: 5.5 * 100,
                image: 'https://yellow-wonderful-finch-712.mypinata.cloud/ipfs/QmcpEdSpcgigEbdaJG94nAfHV2eBgxwqg1Poxdiq93WcZV/1.png',
                external_url: 'https://chronicle.quest/',
                attributes: [{
                    trait_type: 'Status',
                    value: 'Early adaptooooooooooors',
                },
                {
                    trait_type: 'Minted',
                    value: new Date().toISOString(),
                },],
                properties: {
                    category: 'image',
                    files: [
                        {
                            file: 'https://yellow-wonderful-finch-712.mypinata.cloud/ipfs/QmcpEdSpcgigEbdaJG94nAfHV2eBgxwqg1Poxdiq93WcZV/1.png',
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
                collectionMint: cNftConfig.collection,
                metadata: {
                    name: "test nft Collection",
                    uri: nftItemJsonUri,
                    sellerFeeBasisPoints: 5.5 * 100,
                    collection: { key: cNftConfig.collection, verified: false },
                    creators: [{
                        "address": publicKey("GknJwfsZG3tsdj1XNNjgoL5DeJqZyh94zdJoQuy2gxpm"),
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
