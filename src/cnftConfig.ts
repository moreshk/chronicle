import { publicKey } from "@metaplex-foundation/umi";
import { decode } from "bs58";

export const cNftConfig = {
    rpc: 'https://rpc.helius.xyz/?api-key=1bd7151b-2c57-45f5-8172-b32538120d8e',
    imageToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDcxZDBBNWFiMmIzRUFFN2RCMTZiOTdBYzI0RDkwMGVlMDUzRjYyMGEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwODM4NjM5MDgwNSwibmFtZSI6ImNocm9uaWNsZSJ9.0i7VV7uOxBO_M_y3GBMZ24tA6XblAj4AHUOSDwYo89I',
    walletKey: decode("2zjd5sqmipMhFjWn17DW6yLXEVTv7pGLRkhjEw1cb9e39ZzmPzFZHfUHb1u8146Tir368t5g3N7tdMrBDsCen9mi"),
    merkleTree: publicKey("3DgwUGboLQGMfVkf5pxn4jqDwfLqcZ6nr4EC78WSrPJ9"),
    collection: publicKey('EgqvfoZcLHvZZ5SdtueFB1s572ymV7iC4egjbGQ2Fg74'),
    COLLECTION_SYMBOL: 'test',
    COLLECTION_NAME: 'Symbol',
    COLLECTION_DESCRIPTION: 'description'

}
