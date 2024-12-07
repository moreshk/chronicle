import React from 'react';
import { motion } from 'framer-motion';
import { CharacterOptions } from '../data/characterData';

interface CharacterPreviewProps {
  characterOptions: CharacterOptions;
  characterImage: string | null;
  isLoading: boolean;
  onGenerateCharacter: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ 
  characterOptions, 
  characterImage, 
  isLoading, 
  onGenerateCharacter 
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl aspect-square bg-neutral-800 border-2 border-neutral-700 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
        {characterImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={characterImage} alt="Generated character" className="w-full h-full object-cover" />
        ) : (
          <p className="text-neutral-400">Character Preview</p>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-xl inline-flex h-12 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={onGenerateCharacter}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Character'}
      </motion.button>
    </div>
  );
};

export default CharacterPreview; 