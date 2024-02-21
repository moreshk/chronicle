import { publicKey } from "@metaplex-foundation/umi";
import { decode } from "bs58";

export const cNftConfig = {
    rpc: 'https://api.devnet.solana.com',
    imageToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA5NWM2NDdlNkNGZTliY2E1Q0MxNDU2RmM0MjBhRTdGNEE5MTlkODUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwODQyNzU3MzE0MCwibmFtZSI6ImRldi1uZXQtdGVzdCJ9.tfdGbH4jOkgelUkN8oD1T2NNd2QfGr7pGq11-mrKvDY',
    walletKey: decode("2zjd5sqmipMhFjWn17DW6yLXEVTv7pGLRkhjEw1cb9e39ZzmPzFZHfUHb1u8146Tir368t5g3N7tdMrBDsCen9mi"),
    merkleTree: publicKey("3DgwUGboLQGMfVkf5pxn4jqDwfLqcZ6nr4EC78WSrPJ9"),
    collection: publicKey('EgqvfoZcLHvZZ5SdtueFB1s572ymV7iC4egjbGQ2Fg74'),
    COLLECTION_SYMBOL: 'test',
    COLLECTION_NAME: 'Symbol',
    COLLECTION_DESCRIPTION: 'description'

}
