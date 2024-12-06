import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

export const clientUmi = createUmi('https://rpc.helius.xyz/?api-key=1bd7151b-2c57-45f5-8172-b32538120d8e')
    .use(mplTokenMetadata())
    .use(mplBubblegum())
    .use(dasApi())

// export const clientUmi = createUmi('https://omniscient-spring-surf.solana-devnet.quiknode.pro/aa4fd5250ec7587a58184760c81b7c86b2f6190b/')
//     .use(mplTokenMetadata())
//     .use(mplBubblegum())
//     .use(dasApi())
