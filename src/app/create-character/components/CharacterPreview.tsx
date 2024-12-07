import React from 'react';
import { motion } from 'framer-motion';
import { CharacterOptions } from '../characterData';

interface CharacterPreviewProps {
  characterOptions: CharacterOptions;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ characterOptions }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="w-64 h-64 bg-neutral-800 border-2 border-neutral-700 rounded-lg flex items-center justify-center mb-4">
        <p className="text-neutral-400">Character Preview</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-64 inline-flex h-12 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={() => {/* Add generation logic here */}}
      >
        Generate Character
      </motion.button>
    </div>
  );
};

export default CharacterPreview; 