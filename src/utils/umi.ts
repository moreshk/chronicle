import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

export const umi = createUmi(process.env.RPC!)
    .use(mplTokenMetadata())
    .use(mplBubblegum())
    .use(nftStorageUploader({ token: process.env.NFT_STORAGE_API_TOKEN! }))
    .use(dasApi())
