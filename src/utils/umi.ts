import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { cNftConfig } from '@/cnftConfig'
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage'

export const umi = createUmi(cNftConfig.rpc)
    .use(mplTokenMetadata())
    .use(mplBubblegum())
    .use(nftStorageUploader({ token: cNftConfig.imageToken }))
