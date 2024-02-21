
import { useState } from "react";
import { createCnftTree } from "@/serverAction/cnft";


export const useMerkleTreeCreate = () => {
  const [loading, setLoading] = useState(false);
  const [treeAddress, setTreeAddress] = useState('')

  const createMerkelTree = async () => {
    try {
      const publicKey = await createCnftTree()
      setLoading(true);
      if (publicKey) {
        setTreeAddress(publicKey)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return { createMerkelTree, loading, treeAddress };
};
