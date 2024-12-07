export interface CharacterOptions {
  class: string;
  species: string;
  hairColour: string;
  skinColour: string;
  clothing: string;
  headpiece: string;
}

export interface OptionsType {
  class: string[];
  species: string[];
  hairColour: string[];
  skinColour: string[];
  clothing: {
    [key: string]: string[];
  };
  headpiece: {
    [key: string]: string[];
  };
}

export const options: OptionsType = {
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