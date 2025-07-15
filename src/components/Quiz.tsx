import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  TextField,
  Alert,
  IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import useSound from 'use-sound';
import beepSound from '../assets/beep.mp3';

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

const Quiz: React.FC = () => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBeep] = useSound(beepSound);

  const dotDuration = 200;
  const dashDuration = dotDuration * 3;
  const elementGap = dotDuration;

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const letters = Object.keys(morseCodeMap);
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setCurrentLetter(randomLetter);
    setUserGuess('');
    setFeedback({ type: '', message: '' });
  };

  const playMorseCode = async (code: string) => {
    if (isPlaying) return;
    setIsPlaying(true);

    for (const symbol of code) {
      if (symbol === '.') {
        playBeep();
        await new Promise(resolve => setTimeout(resolve, dotDuration));
      } else if (symbol === '-') {
        playBeep();
        await new Promise(resolve => setTimeout(resolve, dashDuration));
      }
      await new Promise(resolve => setTimeout(resolve, elementGap));
    }

    setIsPlaying(false);
  };

  const handleSubmit = () => {
    setTotal(prev => prev + 1);
    
    if (userGuess.toUpperCase() === currentLetter) {
      setScore(prev => prev + 1);
      setFeedback({ type: 'success', message: 'Correct!' });
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Incorrect. The correct answer was ${currentLetter} (${morseCodeMap[currentLetter]})` 
      });
    }

    setTimeout(generateNewQuestion, 2000);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Morse Code Quiz
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom align="center">
                Listen to the Morse code and guess the letter or number
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <IconButton
                  color="primary"
                  size="large"
                  onClick={() => playMorseCode(morseCodeMap[currentLetter])}
                  disabled={isPlaying}
                >
                  <PlayArrowIcon fontSize="large" />
                </IconButton>
              </Box>

              <TextField
                fullWidth
                label="Your guess"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={!userGuess}
              >
                Submit
              </Button>

              {feedback.type && (
                <Alert severity={feedback.type} sx={{ mt: 2 }}>
                  {feedback.message}
                </Alert>
              )}

              <Typography variant="h6" align="center" sx={{ mt: 3 }}>
                Score: {score}/{total} ({total > 0 ? Math.round((score/total) * 100) : 0}%)
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Quiz; 