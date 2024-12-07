"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const CharacterCreation = () => {
  const [characterOptions, setCharacterOptions] = useState({
    class: '',
    species: '',
    hairColour: '',
    skinColour: '',
    clothing: '',
    headpiece: '',
  });

  const options = {
    class: ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'],
    species: ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'],
    hairColour: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Bald', 'Blue', 'Green', 'Purple', 'Pink', 'Orange', 'Silver'],
    skinColour: ['Ivory', 'Olive', 'Tan', 'Bronze', 'Amber', 'Caramel', 'Sienna', 'Chestnut', 'Mahogany', 'Ebony', 'Alabaster', 'Porcelain', 'Onyx'],
    clothing: {
      Barbarian: ['Barbarian Outfit', 'Topless warpaint', 'Heavy Fur Armor'],
      Bard: ['Padded Armor', 'Leather Armor', 'Studded Leather Armor', 'Rogue outfit', 'Fine Robes'],
      Rogue: ['Padded Armor', 'Leather Armor', 'Studded Leather Armor', 'Rogue outfit', 'Fine Robes'],
      Cleric: ['Padded Armor', 'Leather Armor', 'Studded Leather Armor', 'Hide Armor', 'Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate', 'Ring Mail', 'Chain Mail', 'Splint Armor', 'Full Plate Armor'],
      Fighter: ['Padded Armor', 'Leather Armor', 'Studded Leather Armor', 'Hide Armor', 'Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate', 'Ring Mail', 'Chain Mail', 'Splint Armor', 'Full Plate Armor'],
      Paladin: ['Padded Armor', 'Leather Armor', 'Studded Leather Armor', 'Hide Armor', 'Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate', 'Ring Mail', 'Chain Mail', 'Splint Armor', 'Full Plate Armor'],
      Druid: ['Padded Armor', 'Leather Armor', 'Hide Armor', 'Studded Leather Armor'],
      Ranger: ['Padded Armor', 'Leather Armor', 'Studded Leather Armor', 'Hide Armor', 'Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate'],
      Monk: ['Monk\'s robes', 'Tattered clothes', 'Martial Arts Robes'],
      Sorcerer: ['Mage\'s robes', 'Elemental Attire', 'Enchanted Robes', 'Dark Magic Robes', 'Fine Robes', 'Arcane Robes', 'Battlemage Outfit'],
      Warlock: ['Mage\'s robes', 'Elemental Attire', 'Enchanted Robes', 'Dark Magic Robes', 'Fine Robes', 'Arcane Robes', 'Battlemage Outfit'],
      Wizard: ['Mage\'s robes', 'Elemental Attire', 'Enchanted Robes', 'Dark Magic Robes', 'Fine Robes', 'Arcane Robes', 'Battlemage Outfit'],
    },
    headpiece: {
      Bard: ['None', 'Hat', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Rogue: ['None', 'Hat', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Ranger: ['None', 'Hat', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Monk: ['None', 'Hat', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Fighter: ['None', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband', 'Coif', 'Open face helmet', 'Paladin helmet', 'Great Helm'],
      Sorcerer: ['Wizard\'s hat', 'Headband of intellect', 'Astrologers Cap', 'None', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Wizard: ['Wizard\'s hat', 'Headband of intellect', 'Astrologers Cap', 'None', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Warlock: ['Wizard\'s hat', 'Headband of intellect', 'Astrologers Cap', 'None', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Barbarian: ['Viking Helmet', 'Animal helmet', 'Gladiator Helmet', 'None', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Paladin: ['Coif', 'Open face helmet', 'Paladin helmet', 'Great Helm', 'Halo', 'Glowing Halo', 'Infernal Halo', 'None', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Cleric: ['Coif', 'Open face helmet', 'Paladin helmet', 'Great Helm', 'Halo', 'Glowing Halo', 'Infernal Halo', 'None', 'Hood', 'Headband', 'Cloak', 'Cape', 'Crown', 'Circlet', 'Glowing Cape', 'Jeweled Headband'],
      Druid: ['Leafy Crown', 'Antler Headdress', 'Vine Circlet', 'Totem mask', 'Horned helmet', 'Animal head helmet'],
    },
  };

  const handleOptionChange = (option: string, value: string) => {
    setCharacterOptions(prev => ({ ...prev, [option]: value }));
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
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">
        <div className="flex-1 space-y-4">
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{key}</label>
              <select
                value={characterOptions[key as keyof typeof characterOptions]}
                onChange={(e) => handleOptionChange(key, e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select {key}</option>
                {Array.isArray(value)
                  ? value.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))
                  : (characterOptions.class && typeof value === 'object' && value[characterOptions.class as keyof typeof value])
                    ? value[characterOptions.class as keyof typeof value].map((option: string) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    : null}
              </select>
            </div>
          ))}
        </div>
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
      </div>
    </main>
  );
};

export default CharacterCreation;
