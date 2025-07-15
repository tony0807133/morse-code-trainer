import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';

// Morse code dictionary
const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

const { width, height } = Dimensions.get('window');

// Custom hook for quiz logic
const useQuiz = () => {
  const [currentQuizMode, setCurrentQuizMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);

  // Generate a new random question based on the quiz mode
  const generateNewQuestion = useCallback(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
    
    // Get all available characters
    const allChars = Object.keys(morseCodeMap);
    
    // Select random character as the correct answer
    const correctChar = allChars[Math.floor(Math.random() * allChars.length)];
    const correctMorse = morseCodeMap[correctChar];
    
    // Create 3 wrong options different from the correct answer
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
      const randomMorse = morseCodeMap[randomChar];
      
      // For morse-to-text mode, we need unique characters
      if (currentQuizMode === 'morse-to-text') {
        if (randomChar !== correctChar && !wrongOptions.includes(randomChar)) {
          wrongOptions.push(randomChar);
        }
      } 
      // For text-to-morse mode, we need unique morse codes
      else {
        if (randomMorse !== correctMorse && !wrongOptions.map(o => morseCodeMap[o]).includes(randomMorse)) {
          wrongOptions.push(randomChar);
        }
      }
    }
    
    // Combine and shuffle all options
    let allOptions = [correctChar, ...wrongOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    if (currentQuizMode === 'morse-to-text') {
      setCurrentQuestion(correctMorse);
      setOptions(allOptions);
    } else {
      setCurrentQuestion(correctChar);
      setOptions(allOptions);
    }
  }, [currentQuizMode]);

  // Handle when user selects an option
  const handleSelectOption = useCallback((option) => {
    setSelectedOption(option);
    
    // Check if the answer is correct
    let correct = false;
    if (currentQuizMode === 'morse-to-text') {
      // Current question is morse, option is text
      correct = morseCodeMap[option] === currentQuestion;
    } else {
      // Current question is text, option is text but we compare morse
      correct = morseCodeMap[option] === morseCodeMap[currentQuestion];
    }
    
    setIsCorrect(correct);
    setShowAnswer(true);
    
    // Update score
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (questionCount + 1 < totalQuestions) {
        setQuestionCount(prevCount => prevCount + 1);
        generateNewQuestion();
      } else {
        // Quiz is finished
        setCurrentQuizMode(null);
        // Reset for next quiz
        setTimeout(() => {
          setQuestionCount(0);
          setScore(0);
        }, 500);
      }
    }, 1500);
  }, [currentQuestion, currentQuizMode, generateNewQuestion, questionCount, totalQuestions]);

  // Start a new quiz
  const startQuiz = useCallback((mode) => {
    setCurrentQuizMode(mode);
    setQuestionCount(0);
    setScore(0);
  }, []);

  // Effects for handling new questions
  useEffect(() => {
    if (currentQuizMode) {
      generateNewQuestion();
    }
  }, [currentQuizMode, generateNewQuestion]);

  return {
    currentQuizMode, 
    setCurrentQuizMode,
    currentQuestion,
    options,
    selectedOption,
    isCorrect,
    score,
    questionCount,
    totalQuestions,
    showAnswer,
    handleSelectOption,
    startQuiz
  };
};

// Reusable component for displaying Morse code
const MorseCode = memo(({ code, style }) => {
  if (!code) return null;
  
  return (
    <View style={[styles.morseContainer, style]}>
      {code.split('').map((char, index) => (
        <Text key={index} style={char === '.' ? styles.dotChar : styles.dashChar}>
          {char === '.' ? '•' : '—'}
        </Text>
      ))}
    </View>
  );
});

// Quiz Option Button Component
const OptionButton = memo(({ 
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
    : morseCodeMap[option] === morseCodeMap[currentQuestion];
  
  const getButtonStyle = () => {
    if (isSelectedOption) {
      return isCorrect ? styles.correctOption : styles.wrongOption;
    }
    if (showAnswer && !selectedOption && isCorrectAnswer) {
      return styles.highlightCorrect;
    }
    return null;
  };

  const getTextStyle = () => {
    if (isSelectedOption) {
      return isCorrect ? styles.correctOptionText : styles.wrongOptionText;
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[styles.optionButton, getButtonStyle()]}
      onPress={() => !selectedOption && onSelect(option)}
      disabled={!!selectedOption}
    >
      {currentQuizMode === 'morse-to-text' ? (
        <Text style={[styles.optionText, getTextStyle()]}>
          {option}
        </Text>
      ) : (
        <View style={[styles.optionMorse, getTextStyle()]}>
          <MorseCode code={morseCodeMap[option]} />
        </View>
      )}
    </TouchableOpacity>
  );
});

// Quiz Selection Screen
const QuizSelectionScreen = memo(({ onStartQuiz, onGoBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Morse Code Quizzes</Text>
      <Text style={styles.description}>
        Challenge yourself with fun interactive Morse code quizzes.
      </Text>
      
      <View style={styles.quizTypesContainer}>
        <TouchableOpacity 
          style={[styles.quizTypeCard, styles.cardMorseToText]}
          onPress={() => onStartQuiz('morse-to-text')}
        >
          <Text style={styles.cardTitle}>Morse → Text</Text>
          <Text style={styles.cardDescription}>
            See Morse code and select the matching letter or number
          </Text>
          <View style={styles.cardIcon}>
            <Text style={styles.morseExample}>• • — •</Text>
            <Text style={styles.arrowIcon}>↓</Text>
            <Text style={styles.textExample}>F</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.quizTypeCard, styles.cardTextToMorse]}
          onPress={() => onStartQuiz('text-to-morse')}
        >
          <Text style={styles.cardTitle}>Text → Morse</Text>
          <Text style={styles.cardDescription}>
            See a letter or number and select the matching Morse code
          </Text>
          <View style={styles.cardIcon}>
            <Text style={styles.textExample}>K</Text>
            <Text style={styles.arrowIcon}>↓</Text>
            <Text style={styles.morseExample}>— • —</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={onGoBack}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

// Quiz Progress Bar Component
const QuizProgress = memo(({ current, total }) => {
  const progressPercentage = useMemo(() => {
    return `${((current + 1) / total) * 100}%`;
  }, [current, total]);

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Question {current + 1} of {total}
      </Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressPercentage }]} />
      </View>
    </View>
  );
});

// Quiz Question Component
const QuizQuestion = memo(({ mode, question }) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>
        {mode === 'morse-to-text' 
          ? 'What letter or number is this Morse code?' 
          : 'What is the Morse code for this character?'}
      </Text>
      <View style={styles.questionContent}>
        {mode === 'morse-to-text' ? (
          <View style={styles.morseQuestion}>
            <MorseCode code={question} />
          </View>
        ) : (
          <Text style={styles.textQuestion}>{question}</Text>
        )}
      </View>
    </View>
  );
});

// Quiz Options Grid Component
const OptionsGrid = memo(({ 
  options, 
  currentQuizMode, 
  selectedOption, 
  isCorrect, 
  showAnswer, 
  currentQuestion, 
  onSelectOption 
}) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => (
        <OptionButton
          key={index}
          option={option}
          currentQuizMode={currentQuizMode}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
          showAnswer={showAnswer}
          currentQuestion={currentQuestion}
          onSelect={onSelectOption}
        />
      ))}
    </View>
  );
});

// Active Quiz Screen
const ActiveQuizScreen = memo(({ 
  quiz, 
  onExit 
}) => {
  const { 
    currentQuizMode, 
    currentQuestion, 
    options, 
    selectedOption, 
    isCorrect, 
    score, 
    questionCount, 
    totalQuestions, 
    showAnswer, 
    handleSelectOption 
  } = quiz;

  return (
    <SafeAreaView style={styles.quizContainer}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.quizHeader}>
        <QuizProgress current={questionCount} total={totalQuestions} />
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
      </View>
      
      <QuizQuestion 
        mode={currentQuizMode} 
        question={currentQuestion} 
      />
      
      <OptionsGrid 
        options={options}
        currentQuizMode={currentQuizMode}
        selectedOption={selectedOption}
        isCorrect={isCorrect}
        showAnswer={showAnswer}
        currentQuestion={currentQuestion}
        onSelectOption={handleSelectOption}
      />
      
      <TouchableOpacity
        style={styles.exitButton}
        onPress={onExit}
      >
        <Text style={styles.exitButtonText}>Exit Quiz</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

// Main component
const QuizzesScreen = ({ navigation }) => {
  const quiz = useQuiz();
  const { currentQuizMode, startQuiz, setCurrentQuizMode } = quiz;
  
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!currentQuizMode) {
    return (
      <QuizSelectionScreen 
        onStartQuiz={startQuiz} 
        onGoBack={handleGoBack} 
      />
    );
  }

  return (
    <ActiveQuizScreen 
      quiz={quiz} 
      onExit={() => setCurrentQuizMode(null)} 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#7F8C8D',
    lineHeight: 24,
  },
  quizTypesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 400,
  },
  quizTypeCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardMorseToText: {
    borderLeftWidth: 5,
    borderLeftColor: '#3498DB',
  },
  cardTextToMorse: {
    borderLeftWidth: 5,
    borderLeftColor: '#E74C3C',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2C3E50',
  },
  cardDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
    lineHeight: 20,
  },
  cardIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  morseExample: {
    fontSize: 16,
    letterSpacing: 3,
    color: '#2C3E50',
    fontFamily: 'monospace',
  },
  textExample: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  arrowIcon: {
    fontSize: 20,
    marginHorizontal: 15,
    color: '#95A5A6',
  },
  backButton: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Quiz screen styles
  quizContainer: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 15,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
  scoreContainer: {
    backgroundColor: '#2C3E50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 15,
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContent: {
    marginVertical: 15,
    alignItems: 'center',
  },
  morseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  morseQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  textQuestion: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  dotChar: {
    fontSize: 24,
    color: '#3498DB',
    marginHorizontal: 1,
  },
  dashChar: {
    fontSize: 24,
    color: '#3498DB',
    marginHorizontal: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  optionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    height: 60,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  optionMorse: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  correctOption: {
    backgroundColor: '#2ECC71',
  },
  wrongOption: {
    backgroundColor: '#E74C3C',
  },
  correctOptionText: {
    color: '#FFFFFF',
  },
  wrongOptionText: {
    color: '#FFFFFF',
  },
  highlightCorrect: {
    backgroundColor: 'rgba(46, 204, 113, 0.3)',
    borderWidth: 2,
    borderColor: '#2ECC71',
  },
  exitButton: {
    backgroundColor: '#95A5A6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizzesScreen; 