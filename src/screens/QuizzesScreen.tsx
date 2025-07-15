import React, { useState, useCallback, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuizzesScreen.css';

// Morse code dictionary
const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

// Custom hook for quiz logic
const useQuiz = () => {
  const [currentQuizMode, setCurrentQuizMode] = useState<'morse-to-text' | 'text-to-morse' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuestions] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const generateNewQuestion = useCallback(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
    
    const allChars = Object.keys(morseCodeMap);
    const correctChar = allChars[Math.floor(Math.random() * allChars.length)];
    const correctMorse = morseCodeMap[correctChar];
    
    let wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
      const randomMorse = morseCodeMap[randomChar];
      
      if (currentQuizMode === 'morse-to-text') {
        if (randomChar !== correctChar && !wrongOptions.includes(randomChar)) {
          wrongOptions.push(randomChar);
        }
      } else {
        if (randomMorse !== correctMorse && !wrongOptions.includes(randomChar)) {
          wrongOptions.push(randomChar);
        }
      }
    }
    
    const allOptions = [correctChar, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    if (currentQuizMode === 'morse-to-text') {
      setCurrentQuestion(correctMorse);
      setOptions(allOptions);
    } else {
      setCurrentQuestion(correctChar);
      setOptions(allOptions);
    }
  }, [currentQuizMode]);

  const handleSelectOption = useCallback((option: string) => {
    setSelectedOption(option);
    
    let correct = false;
    if (currentQuizMode === 'morse-to-text') {
      correct = morseCodeMap[option] === currentQuestion;
    } else {
      correct = morseCodeMap[option] === morseCodeMap[currentQuestion!];
    }
    
    setIsCorrect(correct);
    setShowAnswer(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (questionCount + 1 < totalQuestions) {
        setQuestionCount(prev => prev + 1);
        generateNewQuestion();
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  }, [currentQuestion, currentQuizMode, generateNewQuestion, questionCount, totalQuestions]);

  const startQuiz = useCallback((mode: 'morse-to-text' | 'text-to-morse') => {
    setCurrentQuizMode(mode);
    setQuestionCount(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
    setQuizCompleted(false);
    
    // Set a small timeout to ensure state is updated before generating the first question
    setTimeout(() => {
      const allChars = Object.keys(morseCodeMap);
      const correctChar = allChars[Math.floor(Math.random() * allChars.length)];
      const correctMorse = morseCodeMap[correctChar];
      
      let wrongOptions: string[] = [];
      while (wrongOptions.length < 3) {
        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
        if (randomChar !== correctChar && !wrongOptions.includes(randomChar)) {
          wrongOptions.push(randomChar);
        }
      }
      
      const allOptions = [correctChar, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      if (mode === 'morse-to-text') {
        setCurrentQuestion(correctMorse);
        setOptions(allOptions);
      } else {
        setCurrentQuestion(correctChar);
        setOptions(allOptions);
      }
    }, 0);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentQuizMode(null);
    setQuizCompleted(false);
    setScore(0);
    setQuestionCount(0);
  }, []);

  return {
    currentQuizMode,
    currentQuestion,
    options,
    selectedOption,
    isCorrect,
    score,
    questionCount,
    totalQuestions,
    showAnswer,
    quizCompleted,
    handleSelectOption,
    startQuiz,
    resetQuiz
  };
};

// Option Button Component
const OptionButton = memo<{
  option: string;
  currentQuizMode: 'morse-to-text' | 'text-to-morse' | null;
  selectedOption: string | null;
  isCorrect: boolean | null;
  showAnswer: boolean;
  currentQuestion: string | null;
  onSelect: (option: string) => void;
}>(({ 
  option, 
  currentQuizMode, 
  selectedOption, 
  isCorrect, 
  showAnswer, 
  currentQuestion, 
  onSelect 
}) => {
  const isSelectedOption = selectedOption === option;
  const isCorrectAnswer = currentQuizMode === 'morse-to-text' 
    ? morseCodeMap[option] === currentQuestion 
    : morseCodeMap[option] === morseCodeMap[currentQuestion!];

  return (
    <button
      className={`option-button ${
        isSelectedOption 
          ? isCorrect 
            ? 'correct' 
            : 'wrong'
          : showAnswer && isCorrectAnswer 
            ? 'highlight-correct'
            : ''
      }`}
      onClick={() => !selectedOption && onSelect(option)}
      disabled={!!selectedOption}
    >
      {currentQuizMode === 'morse-to-text' ? (
        <span className="option-text">{option}</span>
      ) : (
        <div className="option-morse">
          {morseCodeMap[option].split('').map((char, i) => (
            <span key={i} className={char === '.' ? 'dot' : 'dash'}>
              {char === '.' ? '•' : '−'}
            </span>
          ))}
        </div>
      )}
    </button>
  );
});

// Results Screen Component
const ResultsScreen: React.FC<{
  score: number;
  totalQuestions: number;
  quizMode: 'morse-to-text' | 'text-to-morse';
  onNewQuiz: () => void;
  onHome: () => void;
}> = ({ score, totalQuestions, quizMode, onNewQuiz, onHome }) => {
  const [showScore, setShowScore] = useState(false);
  
  useEffect(() => {
    // Trigger the score animation after a short delay
    const timer = setTimeout(() => setShowScore(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const percentage = (score / totalQuestions) * 100;
  let message = '';
  let messageClass = '';
  
  if (percentage === 100) {
    message = 'Perfect Score! You\'re a Morse Code Master!';
    messageClass = 'perfect';
  } else if (percentage >= 80) {
    message = 'Excellent! You\'re Almost There!';
    messageClass = 'excellent';
  } else if (percentage >= 60) {
    message = 'Good Job! Keep Practicing!';
    messageClass = 'good';
  } else {
    message = 'Keep Learning! You\'ll Get Better!';
    messageClass = 'keep-trying';
  }

  return (
    <div className="results-screen">
      <h2>Quiz Complete!</h2>
      <div className={`score-display ${showScore ? 'show' : ''}`}>
        <div className="score-circle">
          <div className="score-number">{score}</div>
          <div className="score-total">out of {totalQuestions}</div>
        </div>
      </div>
      <div className={`result-message ${messageClass}`}>{message}</div>
      <div className="quiz-type-info">
        Quiz Type: {quizMode === 'morse-to-text' ? 'Morse to Text' : 'Text to Morse'}
      </div>
      <div className="result-buttons">
        <button className="new-quiz-button" onClick={onNewQuiz}>
          Try Another Quiz
        </button>
        <button className="home-button" onClick={onHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

const QuizStatus: React.FC<{
  currentQuestion: number;
  totalQuestions: number;
  score: number;
}> = ({ currentQuestion, totalQuestions, score }) => (
  <div className="quiz-status">
    <div className="quiz-progress">
      <span>Question</span>
      <span className="quiz-progress-number">
        {currentQuestion} of {totalQuestions}
      </span>
    </div>
    <div className="quiz-score">
      <span>Score:</span>
      <span className="quiz-score-number">{score}</span>
    </div>
  </div>
);

const QuizzesScreen: React.FC = () => {
  const navigate = useNavigate();
  const quiz = useQuiz();

  if (quiz.quizCompleted) {
    return (
      <div className="quizzes-screen">
        <ResultsScreen
          score={quiz.score}
          totalQuestions={quiz.totalQuestions}
          quizMode={quiz.currentQuizMode!}
          onNewQuiz={quiz.resetQuiz}
          onHome={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="quizzes-screen">
      <header className="quiz-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Morse Code Quizzes</h1>
      </header>

      {!quiz.currentQuizMode ? (
        <div className="quiz-selection">
          <h2>Choose Quiz Type</h2>
          <div className="quiz-types">
            <div className="quiz-type-card morse-to-text" onClick={() => quiz.startQuiz('morse-to-text')}>
              <h3>Morse → Text</h3>
              <p>Convert Morse code patterns to letters and numbers</p>
              <div className="example">
                <div className="morse">• • — •</div>
                <div className="arrow">↓</div>
                <div className="text">F</div>
              </div>
            </div>

            <div className="quiz-type-card text-to-morse" onClick={() => quiz.startQuiz('text-to-morse')}>
              <h3>Text → Morse</h3>
              <p>Convert letters and numbers to Morse code patterns</p>
              <div className="example">
                <div className="text">F</div>
                <div className="arrow">↓</div>
                <div className="morse">• • — •</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-container">
          <QuizStatus
            currentQuestion={quiz.questionCount + 1}
            totalQuestions={quiz.totalQuestions}
            score={quiz.score}
          />
          
          <div className="question">
            <div className="question-text">
              {quiz.currentQuizMode === 'morse-to-text' ? (
                <div className="morse-code">
                  {quiz.currentQuestion?.split('').map((char, i) => (
                    <span key={i} className={char === '.' ? 'dot' : 'dash'}>
                      {char === '.' ? '•' : '−'}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="letter">{quiz.currentQuestion}</div>
              )}
            </div>

            <div className="options">
              {quiz.options.map((option) => (
                <OptionButton
                  key={option}
                  option={option}
                  currentQuizMode={quiz.currentQuizMode}
                  selectedOption={quiz.selectedOption}
                  isCorrect={quiz.isCorrect}
                  showAnswer={quiz.showAnswer}
                  currentQuestion={quiz.currentQuestion}
                  onSelect={quiz.handleSelectOption}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesScreen; 