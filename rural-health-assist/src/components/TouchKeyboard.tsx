
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Define keyboard layouts
const numericLayout = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', '→']
];

const alphaNumericLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '.'],
  ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫', '✓'],
  ['', 'SPACE', '']
];

const hindiLayout = [
  ['१', '२', '३', '४', '५', '६', '७', '८', '९', '०'],
  ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
  ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
  ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श'],
  ['⇧', 'ष', 'स', 'ह', 'ा', 'ि', 'ी', 'ु', 'ू', '⌫'],
  ['', 'SPACE', '']
];

type KeyboardType = 'numeric' | 'alphanumeric' | 'hindi';

interface TouchKeyboardProps {
  onKeyPress: (value: string) => void;
  onSubmit?: () => void;
  type?: KeyboardType;
  showKeyboard: boolean;
}

const TouchKeyboard: React.FC<TouchKeyboardProps> = ({
  onKeyPress,
  onSubmit,
  type = 'alphanumeric',
  showKeyboard
}) => {
  const { language } = useLanguage();
  const [shift, setShift] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<string[][]>([]);

  useEffect(() => {
    // Set layout based on type and language
    if (type === 'numeric') {
      setCurrentLayout(numericLayout);
    } else if (type === 'alphanumeric') {
      setCurrentLayout(alphaNumericLayout);
    } else if (type === 'hindi' || language === 'hindi') {
      setCurrentLayout(hindiLayout);
    } else {
      setCurrentLayout(alphaNumericLayout);
    }
  }, [type, language]);

  if (!showKeyboard) return null;

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      // Backspace
      onKeyPress('BACKSPACE');
    } else if (key === 'SPACE') {
      // Space
      onKeyPress(' ');
    } else if (key === '→' || key === '✓') {
      // Submit/Next
      onSubmit && onSubmit();
    } else if (key === '⇧') {
      // Shift
      setShift(!shift);
    } else {
      // Regular character
      onKeyPress(shift ? key.toUpperCase() : key.toLowerCase());
    }
  };

  return (
    <div className="touch-keyboard bg-gray-100 p-2 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      {currentLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((key, keyIndex) => (
            <button
              key={`${rowIndex}-${keyIndex}`}
              className={`
                mx-1 py-3 min-w-[50px] rounded-md text-xl font-medium
                ${key === '' ? 'opacity-0 pointer-events-none' : 'bg-white shadow-md'}
                ${key === 'SPACE' ? 'px-16' : 'px-3'}
                ${key === '⌫' || key === '→' || key === '✓' || key === '⇧' ? 'bg-gray-200' : ''}
                transition-all duration-150 active:scale-95 hover:bg-gray-50
              `}
              onClick={() => handleKeyPress(key)}
            >
              {key === 'SPACE' ? '␣' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TouchKeyboard;
