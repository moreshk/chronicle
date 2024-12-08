import React from 'react';
import { CharacterOptions } from '../data/characterData';
import GenerateCharacterImage from '@/components/GenerateCharacterImage';

interface CharacterPreviewProps {
  characterOptions: CharacterOptions;
  characterImage: string | null;
  setCharacterImage: (imageUrl: string) => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ 
  characterOptions, 
  characterImage,
  setCharacterImage
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
      <GenerateCharacterImage
        characterOptions={characterOptions}
        onImageGenerated={setCharacterImage}
      />
    </div>
  );
};

export default CharacterPreview; 