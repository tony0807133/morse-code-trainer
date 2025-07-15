import { useRef, useCallback, useEffect } from 'react';
import beepSound from '../assets/beep.mp3';

interface SoundPlayer {
  play: (duration: number) => void;
  stop: () => void;
}

export function useSound(): SoundPlayer {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context and fallback audio element
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0;
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 Audio');
      audioRef.current = new Audio(beepSound);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const play = useCallback((duration: number) => {
    if (audioContextRef.current && gainNodeRef.current) {
      // Stop any existing sound
      stop();

      // Create and configure oscillator
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 800; // 800Hz tone
      oscillator.connect(gainNodeRef.current);
      
      // Smooth envelope
      const now = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.setValueAtTime(0, now);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.5, now + 0.01);
      gainNodeRef.current.gain.setValueAtTime(0.5, now + duration / 1000 - 0.01);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, now + duration / 1000);

      oscillator.start(now);
      oscillator.stop(now + duration / 1000);
      oscillatorRef.current = oscillator;

      // Clean up after playback
      setTimeout(stop, duration);
    } else if (audioRef.current) {
      // Fallback to HTML5 Audio
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setTimeout(() => {
        audioRef.current?.pause();
        audioRef.current!.currentTime = 0;
      }, duration);
    }
  }, [stop]);

  return { play, stop };
} 