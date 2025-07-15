import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import '../styles/MorseCodeScreen.css';

// Morse code timing constants (in milliseconds)
const TIMINGS = {
  DOT: 200,
  DASH: 600,
  ELEMENT_GAP: 200,
  LETTER_GAP: 600
};

const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.'
};

interface MorseDisplayProps {
  character: string;
  isPlaying: boolean;
  speed: number;
}

const MorseDisplay: React.FC<MorseDisplayProps> = ({ character, isPlaying, speed }) => {
  const [isActive, setIsActive] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const { play, stop } = useSound();

  useEffect(() => {
    if (isPlaying && character) {
      const morseCode = morseCodeMap[character.toUpperCase()];
      const timeouts: number[] = [];
      let currentTime = 0;

      // Clear any existing timeouts
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];

      // Play the Morse code sequence
      morseCode.split('').forEach((symbol, index) => {
        // Turn on the indicator and play sound
        timeouts.push(
          window.setTimeout(() => {
            setIsActive(true);
            const duration = symbol === '.' ? TIMINGS.DOT : TIMINGS.DASH;
            play(duration / speed);
          }, currentTime)
        );

        // Calculate duration based on symbol and speed
        const duration = symbol === '.' ? TIMINGS.DOT : TIMINGS.DASH;
        
        // Turn off the indicator after the duration
        timeouts.push(
          window.setTimeout(() => {
            setIsActive(false);
            stop();
          }, currentTime + (duration / speed))
        );

        // Add gap between elements
        currentTime += (duration + TIMINGS.ELEMENT_GAP) / speed;
      });

      timeoutsRef.current = timeouts;

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
        stop();
      };
    } else {
      setIsActive(false);
      stop();
    }
  }, [character, isPlaying, speed, play, stop]);

  return (
    <div className="morse-code-display">
      <div className={`morse-indicator ${isActive ? 'active' : ''}`} />
      <div className="morse-text">
        {morseCodeMap[character.toUpperCase()]?.split('').map((symbol, index) => (
          <span key={index} className={symbol === '.' ? 'dot' : 'dash'}>
            {symbol === '.' ? '•' : '−'}
          </span>
        ))}
      </div>
    </div>
  );
};

const MorseCodeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'letters' | 'numbers'>('all');
  const [selectedChar, setSelectedChar] = useState('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const handlePlaySound = () => {
    setIsPlaying(true);
    // Stop playing after the sequence is complete
    const morseCode = morseCodeMap[selectedChar.toUpperCase()];
    const totalDuration = morseCode.split('').reduce((total, symbol) => {
      return total + (symbol === '.' ? TIMINGS.DOT : TIMINGS.DASH) + TIMINGS.ELEMENT_GAP;
    }, 0) / speed;

    setTimeout(() => setIsPlaying(false), totalDuration);
  };

  const filteredCharacters = Object.keys(morseCodeMap).filter(char => {
    if (selectedFilter === 'letters') return /[A-Z]/.test(char);
    if (selectedFilter === 'numbers') return /[0-9]/.test(char);
    return true;
  });

  return (
    <div className="morse-code-screen">
      <h1>Learn Morse Code</h1>

      <div className="filters">
        <button 
          className={`filter-button ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${selectedFilter === 'letters' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('letters')}
        >
          Letters
        </button>
        <button 
          className={`filter-button ${selectedFilter === 'numbers' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('numbers')}
        >
          Numbers
        </button>

        <div className="speed-control">
          <label>Speed:</label>
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>

      <div className="selected-character">
        <h2>{selectedChar}</h2>
        <MorseDisplay 
          character={selectedChar} 
          isPlaying={isPlaying}
          speed={speed}
        />
        <button 
          className="play-button" 
          onClick={handlePlaySound}
          disabled={isPlaying}
        >
          Play Sound
        </button>
      </div>

      <div className="character-grid">
        {filteredCharacters.map(char => (
          <button
            key={char}
            className={`character-button ${selectedChar === char ? 'active' : ''}`}
            onClick={() => setSelectedChar(char)}
          >
            <div className="character">{char}</div>
            <div className="morse-code">
              {morseCodeMap[char].split('').map((symbol, index) => (
                <span key={index} className={symbol === '.' ? 'dot' : 'dash'}>
                  {symbol === '.' ? '•' : '−'}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>
    </div>
  );
};

export default MorseCodeScreen; 