import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateTestItems, playMorseCode } from '../utils/morseCode';
import '../styles/TestScreen.css';

interface TestState {
  stage: 'intro' | 'countdown' | 'testing' | 'results';
  currentItem: number;
  speed: number;
  isLightOn: boolean;
  answers: string[];
  isTransmitting: boolean;
  testItems: string[];
  countdown: number;
}

const TOTAL_ITEMS = 68;
const SINGLE_ITEMS = 60;
const COUNTDOWN_TIME = 5;

const TestScreen: React.FC = () => {
  const navigate = useNavigate();
  const [testState, setTestState] = useState<TestState>({
    stage: 'intro',
    currentItem: 1,
    speed: 1,
    isLightOn: false,
    answers: [],
    isTransmitting: false,
    testItems: [],
    countdown: COUNTDOWN_TIME
  });

  const speedOptions = [0.5, 1, 1.2, 1.5, 2];
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTest = () => {
    console.log('Starting test...');
    const items = generateTestItems();
    setTestState(prev => {
      console.log('Setting countdown state...');
      return {
        ...prev,
        stage: 'countdown',
        testItems: items,
        currentItem: 1,
        answers: [],
        countdown: COUNTDOWN_TIME
      };
    });
  };

  const stopTest = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTestState(prev => ({
      ...prev,
      stage: 'results',
      isTransmitting: false
    }));
  };

  const setSpeed = (speed: number) => {
    setTestState(prev => ({ ...prev, speed }));
  };

  // Add countdown effect
  useEffect(() => {
    console.log('Current stage:', testState.stage);
    console.log('Current countdown:', testState.countdown);
    
    if (testState.stage === 'countdown') {
      console.log('Starting countdown interval...');
      countdownRef.current = setInterval(() => {
        setTestState(prev => {
          console.log('Countdown tick:', prev.countdown);
          if (prev.countdown <= 1) {
            console.log('Countdown finished, starting test...');
            clearInterval(countdownRef.current!);
            return {
              ...prev,
              stage: 'testing',
              isTransmitting: true,
              countdown: COUNTDOWN_TIME,
              currentItem: 1
            };
          }
          return {
            ...prev,
            countdown: prev.countdown - 1
          };
        });
      }, 1000);

      return () => {
        if (countdownRef.current) {
          console.log('Cleaning up countdown interval...');
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [testState.stage, testState.countdown]);

  useEffect(() => {
    if (testState.stage === 'testing' && testState.isTransmitting) {
      const currentText = testState.testItems[testState.currentItem - 1];
      if (currentText) {
        const duration = playMorseCode(
          currentText,
          testState.speed,
          () => setTestState(prev => ({ ...prev, isLightOn: true })),
          () => setTestState(prev => ({ ...prev, isLightOn: false }))
        );

        // Schedule next item
        timeoutRef.current = setTimeout(() => {
          if (testState.currentItem < TOTAL_ITEMS) {
            setTestState(prev => ({
              ...prev,
              currentItem: prev.currentItem + 1,
              answers: [...prev.answers, currentText]
            }));
          } else {
            setTestState(prev => ({
              ...prev,
              stage: 'results',
              isTransmitting: false,
              answers: [...prev.answers, currentText]
            }));
          }
        }, duration + 1000); // Add 1 second extra gap between items
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [testState.currentItem, testState.stage, testState.isTransmitting, testState.speed, testState.testItems]);

  if (testState.stage === 'intro') {
    return (
      <div className="test-screen">
        <h1 className="test-title">Morse Code Test</h1>
        
        <div className="test-section">
          <h2 className="section-title">Test Format</h2>
          <ul className="format-list">
            <li>BLOCKS: 60 Marks - Single alpha-numeric codes (60 codes × 1 mark)</li>
            <li>GROUPS: 40 Marks - 8 Groups of alpha-numeric codes (8 groups × 5 marks)</li>
            <li>TOTAL: 100 Marks</li>
            <li>PASSING MARKS: 70/100</li>
          </ul>
        </div>

        <div className="test-section">
          <h2 className="section-title">Instructions</h2>
          <ol className="instructions-list">
            <li>A light will blink in Morse code pattern</li>
            <li>Write down each letter or number in your notebook</li>
            <li>For groups, write all 5 characters in sequence</li>
            <li>Standard timing will be used:
              <ul>
                <li>Dot = 1 unit, Dash = 3 units</li>
                <li>Gap between elements = 1 unit</li>
                <li>Gap between characters = 3 units</li>
                <li>Gap between words/groups = 7 units</li>
              </ul>
            </li>
            <li>All 68 items will be presented sequentially</li>
            <li>All answers will be shown at the end for scoring</li>
          </ol>
        </div>

        <button className="start-button" onClick={startTest}>
          Start Test
        </button>
      </div>
    );
  }

  if (testState.stage === 'countdown') {
    console.log('Rendering countdown screen...');
    return (
      <div className="test-screen countdown">
        <div className="countdown-display">
          <h2>Test starting in</h2>
          <div className="countdown-number">{testState.countdown}</div>
          <p>Get ready!</p>
        </div>
      </div>
    );
  }

  if (testState.stage === 'testing') {
    return (
      <div className="test-screen testing">
        <button className="stop-button" onClick={stopTest}>
          Stop Test
        </button>

        <div className="test-status">
          <p className="transmitting">Transmitting...</p>
          <p className="item-count">Item {testState.currentItem} of {TOTAL_ITEMS}</p>
          <p className="item-type">
            {testState.currentItem <= SINGLE_ITEMS ? 'Single Character' : 'Character Group'}
          </p>
        </div>

        <div className={`morse-light ${testState.isLightOn ? 'on' : 'off'}`} />

        <div className="speed-control">
          <p>Speed:</p>
          <div className="speed-buttons">
            {speedOptions.map(speed => (
              <button
                key={speed}
                className={`speed-button ${testState.speed === speed ? 'active' : ''}`}
                onClick={() => setSpeed(speed)}
              >
                {speed}X
              </button>
            ))}
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(testState.currentItem / TOTAL_ITEMS) * 100}%` }}
          />
          <p className="progress-text">{Math.round((testState.currentItem / TOTAL_ITEMS) * 100)}% Complete</p>
        </div>
      </div>
    );
  }

  if (testState.stage === 'results') {
    const totalSingleChars = Math.min(testState.currentItem, SINGLE_ITEMS);
    const totalGroups = Math.max(0, Math.floor((testState.currentItem - SINGLE_ITEMS)));
    
    return (
      <div className="test-screen results">
        <h1 className="test-title">Test Stopped</h1>

        <div className="test-section">
          <h2 className="section-title">Test Summary</h2>
          <div className="summary">
            <p>Single Characters: {totalSingleChars} × 1 = {totalSingleChars} marks</p>
            <p>Character Groups: {totalGroups} × 5 = {totalGroups * 5} marks</p>
            <p className="stopped-info">
              Test stopped after {testState.currentItem} of {TOTAL_ITEMS} items
            </p>
            <p className="total-score">
              Total: {totalSingleChars + (totalGroups * 5)}/{testState.currentItem < TOTAL_ITEMS ? testState.currentItem : 100}
            </p>
          </div>
        </div>

        <div className="test-section">
          <h2 className="section-title">Answer Key</h2>
          <p className="answer-instruction">
            Compare with your notes for the {testState.currentItem} items you attempted
          </p>
          <div className="answers-list">
            {testState.answers.map((answer, index) => (
              <div key={index} className="answer-item">
                <div className="answer-number">#{index + 1}</div>
                <div className="answer-type">
                  {index < SINGLE_ITEMS ? 'Single (1pt)' : 'Group (5pts)'}
                </div>
                <div className="morse-code">{answer}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button 
            className="new-test-button" 
            onClick={() => setTestState(prev => ({ 
              ...prev, 
              stage: 'intro',
              currentItem: 1,
              answers: [],
              testItems: []
            }))}
          >
            New Test
          </button>
          <button className="home-button" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </div>
    );
  }

  // Return null for any unknown state
  return null;
};

export default TestScreen; 