import { PublicKey } from "@solana/web3.js";
import { utils } from "@project-serum/anchor";
import BN from "bn.js";

export const findDistributorKey = async (
  base: PublicKey,
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("MerkleDistributor"), base.toBytes()],
    programId
  );
};

export const findClaimStatusKey = async (
  index: number,
  distributor: PublicKey,
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("ClaimStatus"),
      new BN(index).toArrayLike(Buffer, "le", 8),
      distributor.toBytes(),
    ],
    programId
  );
};
