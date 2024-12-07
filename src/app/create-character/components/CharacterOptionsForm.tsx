import React from 'react';
import { CharacterOptions, OptionsType } from '../data/characterData';

interface CharacterOptionsFormProps {
  options: OptionsType;
  characterOptions: CharacterOptions;
  handleOptionChange: (option: string, value: string) => void;
}

const CharacterOptionsForm: React.FC<CharacterOptionsFormProps> = ({
  options,
  characterOptions,
  handleOptionChange,
}) => {
  return (
    <div className="flex-1 space-y-4">
      {Object.entries(options).map(([key, value]) => (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{key}</label>
          <select
            value={characterOptions[key as keyof CharacterOptions]}
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
  );
};

export default CharacterOptionsForm; 