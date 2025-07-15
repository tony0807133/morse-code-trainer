import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  IconButton,
} from '@mui/material';
import useSound from 'use-sound';
import beepSound from '../assets/beep.mp3';

// Morse code dictionary
const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
  'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
  'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
  'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.'
};

const speedOptions = [
  { value: 0.5, label: '0.5X' },
  { value: 1, label: '1X' },
  { value: 1.2, label: '1.2X' },
  { value: 1.5, label: '1.5X' },
  { value: 2, label: '2X' }
];

const MorseCode: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState('2');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'letters', 'numbers'
  const [playBeep] = useSound(beepSound, {
    volume: 1.0,
    interrupt: true,
  });

  // Base timing values in milliseconds
  const baseSpeed = 200;
  const dotDuration = baseSpeed / selectedSpeed;
  const dashDuration = dotDuration * 3;
  const elementGap = dotDuration;
  const letterGap = dotDuration * 3;

  const playMorseCode = async (code: string) => {
    if (isPlaying) return;
    setIsPlaying(true);

    try {
      for (const symbol of code) {
        if (symbol === '.') {
          try {
            await playBeep();
          } catch (error) {
            console.error('Sound playback failed:', error);
          }
          await new Promise(resolve => setTimeout(resolve, dotDuration));
        } else if (symbol === '-') {
          try {
            await playBeep();
          } catch (error) {
            console.error('Sound playback failed:', error);
          }
          await new Promise(resolve => setTimeout(resolve, dashDuration));
        }
        await new Promise(resolve => setTimeout(resolve, elementGap));
      }
    } finally {
      setIsPlaying(false);
    }
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    const morseCode = morseCodeMap[letter];
    playMorseCode(morseCode);
  };

  const getFilteredCharacters = () => {
    if (filter === 'letters') {
      return Object.keys(morseCodeMap).filter(char => /[A-Z]/.test(char));
    } else if (filter === 'numbers') {
      return Object.keys(morseCodeMap).filter(char => /[0-9]/.test(char));
    }
    return Object.keys(morseCodeMap);
  };

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh',
      p: 2
    }}>
      <Box sx={{ 
        bgcolor: '#4a90e2',
        color: 'white',
        p: 2,
        mb: 2,
        borderRadius: '0 0 8px 8px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <IconButton 
          sx={{ color: 'white', mr: 2 }}
          onClick={() => window.history.back()}
        >
          ←
        </IconButton>
        <Typography variant="h5" component="h1">
          Morse Code Trainer
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        mb: 2 
      }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#ff9800',
            color: 'white',
            borderRadius: '20px',
            '&:hover': {
              bgcolor: '#f57c00'
            }
          }}
        >
          Practice Mode
        </Button>
      </Box>

      <Paper sx={{ 
        p: 3, 
        mb: 2, 
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          width: '100%', 
          height: '120px', 
          bgcolor: 'white',
          borderRadius: '12px',
          mb: 3,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Box sx={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            bgcolor: isPlaying ? '#f44336' : '#f44336',
            transition: 'all 0.2s'
          }} />
        </Box>

        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Speed:</Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            justifyContent: 'center'
          }}>
            {speedOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedSpeed === option.value ? "contained" : "outlined"}
                onClick={() => setSelectedSpeed(option.value)}
                sx={{
                  borderRadius: '20px',
                  bgcolor: selectedSpeed === option.value ? '#4a90e2' : '#e0e0e0',
                  color: selectedSpeed === option.value ? 'white' : 'black',
                  '&:hover': {
                    bgcolor: selectedSpeed === option.value ? '#357abd' : '#d5d5d5'
                  }
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Select Character:</Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            mb: 2,
            justifyContent: 'center'
          }}>
            {['All', 'Letters', 'Numbers'].map((type) => (
              <Button
                key={type}
                variant={filter === type.toLowerCase() ? "contained" : "outlined"}
                onClick={() => setFilter(type.toLowerCase())}
                sx={{
                  borderRadius: '20px',
                  bgcolor: filter === type.toLowerCase() ? '#4a90e2' : '#e0e0e0',
                  color: filter === type.toLowerCase() ? 'white' : 'black',
                  '&:hover': {
                    bgcolor: filter === type.toLowerCase() ? '#357abd' : '#d5d5d5'
                  }
                }}
              >
                {type}
              </Button>
            ))}
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            mb: 3
          }}>
            {getFilteredCharacters().map((char) => (
              <Button
                key={char}
                onClick={() => handleLetterClick(char)}
                sx={{
                  minWidth: 0,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  p: 0,
                  bgcolor: selectedLetter === char ? '#4a90e2' : '#e0e0e0',
                  color: selectedLetter === char ? 'white' : 'black',
                  '&:hover': {
                    bgcolor: selectedLetter === char ? '#357abd' : '#d5d5d5'
                  }
                }}
              >
                {char}
              </Button>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="body1">
              Morse Code:
            </Typography>
            <Typography variant="h6">
              {morseCodeMap[selectedLetter]}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => playMorseCode(morseCodeMap[selectedLetter])}
            disabled={isPlaying}
            sx={{
              bgcolor: '#4caf50',
              color: 'white',
              borderRadius: '8px',
              py: 1.5,
              '&:hover': {
                bgcolor: '#388e3c'
              }
            }}
          >
            Play
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MorseCode; 