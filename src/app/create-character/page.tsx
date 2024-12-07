"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import CharacterOptionsForm from './components/CharacterOptionsForm';
import CharacterPreview from './components/CharacterPreview';
import { CharacterOptions, options } from './data/characterData';
import { createCharacterImage } from '../../serverAction/openAI';

const CharacterCreation = () => {
  const [characterOptions, setCharacterOptions] = useState<CharacterOptions>({
    class: '',
    species: '',
    sex: '',
    hairColour: '',
    skinColour: '',
    clothing: '',
    headpiece: '',
  });
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionChange = (option: string, value: string) => {
    setCharacterOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleGenerateCharacter = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await createCharacterImage(characterOptions);
      setCharacterImage(imageUrl);
    } catch (error) {
      console.error("Error generating character image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 sm:p-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="font-bold text-3xl sm:text-4xl text-center text-balance mb-8"
      >
        Create Your Character
      </motion.h1>
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8">
        <CharacterOptionsForm
          options={options}
          characterOptions={characterOptions}
          handleOptionChange={handleOptionChange}
        />
        <CharacterPreview 
          characterOptions={characterOptions} 
          characterImage={characterImage}
          isLoading={isLoading}
          onGenerateCharacter={handleGenerateCharacter}
        />
      </div>
    </main>
  );
};

export default CharacterCreation;
