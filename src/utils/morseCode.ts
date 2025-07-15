export const MORSE_CODE: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.'
};

export const TIMING = {
  DOT: 1,
  DASH: 3,
  ELEMENT_GAP: 1,
  CHAR_GAP: 3,
  WORD_GAP: 7
};

export const generateTestItems = () => {
  const characters = Object.keys(MORSE_CODE);
  const items: string[] = [];

  // Generate 60 single characters
  for (let i = 0; i < 60; i++) {
    items.push(characters[Math.floor(Math.random() * characters.length)]);
  }

  // Generate 8 groups of 5 characters
  for (let i = 0; i < 8; i++) {
    let group = '';
    for (let j = 0; j < 5; j++) {
      group += characters[Math.floor(Math.random() * characters.length)];
    }
    items.push(group);
  }

  return items;
};

export const playMorseCode = (
  text: string,
  speed: number,
  onLightOn: () => void,
  onLightOff: () => void
) => {
  const baseUnit = 100 / speed; // Base timing unit in milliseconds
  let currentDelay = 0;

  const schedule = (on: boolean, delay: number) => {
    setTimeout(() => {
      if (on) onLightOn();
      else onLightOff();
    }, delay);
  };

  text.split('').forEach((char) => {
    const morseChar = MORSE_CODE[char.toUpperCase()] || '';

    morseChar.split('').forEach((symbol: string) => {
      // Turn light on
      schedule(true, currentDelay);

      // Calculate duration based on symbol
      const duration = symbol === '.' ? 
        TIMING.DOT * baseUnit : 
        TIMING.DASH * baseUnit;

      currentDelay += duration;

      // Turn light off
      schedule(false, currentDelay);

      // Add gap between elements
      currentDelay += TIMING.ELEMENT_GAP * baseUnit;
    });

    // Add gap between characters (subtract the element gap already added)
    currentDelay += (TIMING.CHAR_GAP - TIMING.ELEMENT_GAP) * baseUnit;
  });

  return currentDelay; // Return total duration
}; 