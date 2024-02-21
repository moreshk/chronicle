
'use client'

import { useState } from 'react';
import { createCollection } from '@/serverAction/cnft';


export const useCreateCollection = () => {
  const [loading, setLoading] = useState(false);
  const [treeAddress, setTreeAddress] = useState('')

  const createCollectionClick = async () => {
    try {
      setLoading(true);
      const publicKey = await createCollection()
      console.log(publicKey)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return { createCollectionClick, loading, treeAddress };
};
