'use server'

import { cNftConfig } from "@/cnftConfig"
import { umi } from "@/utils/umi"
import { createTree } from "@metaplex-foundation/mpl-bubblegum"
import { createGenericFile, createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi"
import { promises as fs } from 'fs';
import { createNft } from "@metaplex-foundation/mpl-token-metadata"
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage'


export const createCnftTree = async () => {
    try {
        const keyPair = umi.eddsa.createKeypairFromSecretKey(cNftConfig.walletKey)
        const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
        umi.use(signerIdentity(signer))
        const merkleTree = generateSigner(umi)
        const builder = await createTree(umi, {
            merkleTree,
            maxDepth: 14,
            maxBufferSize: 64,
        })
        await builder.sendAndConfirm(umi)
        return merkleTree.publicKey
    } catch (e) {
        console.log(e)
        return undefined
    }
}

export const createCollection = async () => {
    const COLLECTION_SYMBOL = 'test'
    const COLLECTION_NAME = 'Symbol'

    try {

        umi.use(nftStorageUploader({ token: cNftConfig.imageToken }))
        const keyPair = umi.eddsa.createKeypairFromSecretKey(cNftConfig.walletKey)
        const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
        umi.use(signerIdentity(signer))
        const collectionImageBuffer = await fs.readFile(process.cwd() + '/public/master.png')
        const collectionImageGenericFile = createGenericFile(
            collectionImageBuffer,
            'scripts/solana/cNFT/example/collectionImageGenericFile.png'
        )

        const [collectionImageUri] = await umi.uploader.upload([
            collectionImageGenericFile,
        ])
        const collectionObject = {
            name: COLLECTION_SYMBOL,
            symbol: COLLECTION_SYMBOL,
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
        console.log('collectionJsonUri:', collectionJsonUri)

        const collectionMint = generateSigner(umi)
        await createNft(umi, {
            mint: collectionMint,
            symbol: COLLECTION_SYMBOL,
            name: COLLECTION_NAME,
            uri: collectionJsonUri,
            sellerFeeBasisPoints: percentAmount(5.5),
            isCollection: true,
        }).sendAndConfirm(umi)

        const collectionMintExplolerUrl = `https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet'}`

        console.log('collectionMint:', collectionMintExplolerUrl)
    } catch (e) {
        console.error(e)
    }

}
