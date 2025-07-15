import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  FlatList,
  StatusBar, 
  Dimensions, 
  LayoutAnimation, 
  UIManager, 
  Platform, 
  SafeAreaView,
  ScrollView
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700;

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

const MorseCodeScreen = ({ navigation }) => {
  // State
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'letters', 'numbers'
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceType, setPracticeType] = useState(''); // 'alphabet' or 'numbers'
  const [practiceLetters, setPracticeLetters] = useState([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [lastResult, setLastResult] = useState(null);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(0)).current;
  
  // Morse light position
  const lightPosition = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  
  // Controls
  const timeoutRef = useRef(null);
  const timeoutsArray = useRef([]);

  // Base timing values in milliseconds
  const dotDuration = 200; // Duration of a dot
  const dashDuration = dotDuration * 3; // Duration of a dash
  const elementGap = dotDuration; // Gap between elements (dots and dashes)
  const letterGap = dotDuration * 3; // Gap between letters

  // Add a new state to track if component is mounted
  const mounted = useRef(true);

  // Helper function to convert a character to its Morse code
  const getMorseCode = (char) => {
    return morseCodeMap[char.toUpperCase()] || '';
  };

  // Generate a visual representation of the Morse code
  const getMorseVisual = (code) => {
    return code.split('').map((char, index) => (
      <View 
        key={index} 
        style={[
          styles.morseVisual, 
          char === '.' ? styles.morseDot : styles.morseDash,
        ]} 
      />
    ));
  };

  // Generate random practice letters
  const generatePracticeLetters = (type) => {
    try {
      let characters;
      if (type === 'alphabet') {
        characters = Object.keys(morseCodeMap).filter(key => /[A-Z]/.test(key));
      } else if (type === 'numbers') {
        characters = Object.keys(morseCodeMap).filter(key => /[0-9]/.test(key));
      } else {
        characters = getFilteredCharacters();
      }
      if (!characters || characters.length === 0) {
        console.log('No characters available for practice');
        return ['A', 'B', 'C', 'D', 'E']; // Fallback to prevent crashes
      }
      const shuffled = [...characters].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5); // Get 5 random characters
    } catch (error) {
      console.log('Error generating practice letters:', error);
      return ['A', 'B', 'C', 'D', 'E']; // Fallback to prevent crashes
    }
  };

  // Start practice mode
  const startPracticeMode = () => {
    try {
      // Reset state first
      clearAllTimeouts();
      fadeAnim.setValue(1);
      setIsPlaying(false);
      setLastResult(null);
      setGuess('');
      
      // Reset practice-related state
      setPracticeType('');
      setPracticeLetters([]);
      setCurrentPracticeIndex(0);
      
      // Use setTimeout to ensure state changes have completed before showing UI
      setTimeout(() => {
        if (mounted.current) {
          try {
            // Use a more basic animation preset that's less likely to crash
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            setPracticeMode(true);
          } catch (innerError) {
            console.log('Animation error:', innerError);
            // Fallback without animation
            setPracticeMode(true);
          }
        }
      }, 50); // Slightly longer delay to ensure state is ready
    } catch (error) {
      console.log('Error starting practice mode:', error);
      // Recover from error
      setIsPlaying(false);
      setPracticeMode(false);
    }
  };

  // Select practice type and start
  const selectPracticeType = (type) => {
    try {
      // Generate practice set before updating state
      const practiceSet = generatePracticeLetters(type);
      
      if (practiceSet && practiceSet.length > 0) {
        setPracticeType(type);
        setPracticeLetters(practiceSet);
        setCurrentPracticeIndex(0);
      } else {
        // Fallback in case generation fails
        console.log('Unable to generate practice set');
        exitPracticeMode();
      }
    } catch (error) {
      console.log('Error selecting practice type:', error);
      exitPracticeMode();
    }
  };

  // Exit practice mode
  const exitPracticeMode = () => {
    try {
      if (!mounted.current) return;
      
      clearAllTimeouts();
      fadeAnim.setValue(1);
      
      // Reset all practice-related state in a batch
      const resetState = () => {
        setIsPlaying(false);
        setPracticeLetters([]);
        setCurrentPracticeIndex(0);
        setGuess('');
        setLastResult(null);
        setPracticeMode(false);
        setPracticeType('');
      };
      
      // Use LayoutAnimation with a callback to ensure state is properly reset
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, resetState);
    } catch (error) {
      console.log('Error exiting practice mode:', error);
      // Force reset in case of error
      setIsPlaying(false);
      setPracticeLetters([]);
      setCurrentPracticeIndex(0);
      setGuess('');
      setLastResult(null);
      setPracticeMode(false);
      setPracticeType('');
    }
  };

  // Check the user's guess
  const checkGuess = (letterGuess) => {
    const currentLetter = practiceLetters[currentPracticeIndex];
    const isCorrect = letterGuess.toUpperCase() === currentLetter.toUpperCase();
    
    setGuess(letterGuess);
    setLastResult(isCorrect);
    
    // Animate success/failure
    if (isCorrect) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          friction: 3,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
        })
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -0.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
    }
    
    // Move to next letter after a delay with mounted check
    const nextTimeout = setTimeout(() => {
      if (!mounted.current) return;
      
      if (currentPracticeIndex < practiceLetters.length - 1) {
        // Slide animation for card transition
        Animated.sequence([
          Animated.timing(cardSlideAnim, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(cardSlideAnim, {
            toValue: width,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(cardSlideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
        
        if (mounted.current) {
          setCurrentPracticeIndex(prev => prev + 1);
          setLastResult(null);
          setGuess('');
        }
      } else {
        // End of practice session
        if (mounted.current) {
          exitPracticeMode();
        }
      }
    }, 1500);
    
    timeoutsArray.current.push(nextTimeout);
  };

  // Filter characters based on the selected mode
  const getFilteredCharacters = () => {
    const keys = Object.keys(morseCodeMap);
    if (filterMode === 'letters') {
      return keys.filter(key => /[A-Z]/.test(key));
    } else if (filterMode === 'numbers') {
      return keys.filter(key => /[0-9]/.test(key));
    }
    return keys;
  };

  // Function to clean up all timeouts
  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutsArray.current.forEach(timeout => clearTimeout(timeout));
    timeoutsArray.current = [];
  };

  // Function to animate blinking based on Morse code
  const animateMorseCode = (morseCode, index = 0) => {
    if (!mounted.current) return;
    if (index >= morseCode.length) {
      // End of sequence, reset
      fadeAnim.setValue(1);
      if (mounted.current) {
        setIsPlaying(false);
      }
      return;
    }

    const element = morseCode[index];
    const duration = element === '.' ? dotDuration / speedMultiplier : dashDuration / speedMultiplier;

    // Calculate position for animation
    const elementWidth = element === '.' ? (isSmallDevice ? 12 : 20) : (isSmallDevice ? 24 : 40);  
    const gap = isSmallDevice ? 6 : 10;
    const totalWidth = morseCode.split('').reduce((total, el, i) => {
      const w = el === '.' ? (isSmallDevice ? 12 : 20) : (isSmallDevice ? 24 : 40);
      return total + w + (i < morseCode.length - 1 ? gap : 0);
    }, 0);
    
    const startX = -totalWidth / 2;
    let posX = startX;
    
    for (let i = 0; i < index; i++) {
      posX += (morseCode[i] === '.' ? (isSmallDevice ? 12 : 20) : (isSmallDevice ? 24 : 40)) + gap;
    }
    
    // Move light to the current element position
    Animated.timing(lightPosition, {
      toValue: { x: posX, y: 0 },
      duration: 300,
      useNativeDriver: true
    }).start();

    // Animate the element (dot or dash)
    Animated.sequence([
      // Turn on
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 10,
        useNativeDriver: true,
      }),
      // Keep on for duration of dot or dash
      Animated.delay(duration),
      // Turn off
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }),
      // Delay between elements
      Animated.delay(elementGap / speedMultiplier),
    ]).start(() => {
      // Move to next element
      const timeout = setTimeout(() => {
        if (mounted.current) {
          animateMorseCode(morseCode, index + 1);
        }
      }, 0);
      
      timeoutRef.current = timeout;
      timeoutsArray.current.push(timeout);
    });
  };

  // Start or stop the animation
  const togglePlay = () => {
    try {
      if (isPlaying) {
        // Stop animation
        clearAllTimeouts();
        fadeAnim.setValue(1);
        setIsPlaying(false);
      } else {
        // Start animation
        setIsPlaying(true);
        const currentChar = practiceMode && practiceLetters && practiceLetters.length > 0 && 
                          currentPracticeIndex < practiceLetters.length ? 
                          practiceLetters[currentPracticeIndex] : selectedLetter;
        
        // Ensure we have a valid character before animating
        if (currentChar) {
          const morseCode = getMorseCode(currentChar);
          if (morseCode) {
            animateMorseCode(morseCode);
          } else {
            console.log('No morse code found for character:', currentChar);
            setIsPlaying(false);
          }
        } else {
          console.log('No valid character to play');
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.log('Error toggling play state:', error);
      // Recover from error
      setIsPlaying(false);
    }
  };

  // Add this cleanup function at the component level
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearAllTimeouts();
      setPracticeLetters([]);
      setCurrentPracticeIndex(0);
    };
  }, []);

  // Update navigation listener for more robust cleanup
  useEffect(() => {
    // Handle potential navigation events
    const unsubscribe = navigation?.addListener?.('beforeRemove', (e) => {
      // Prevent the default behavior which would trigger the unmounting
      e.preventDefault();
      
      // Clean up all resources
      clearAllTimeouts();
      fadeAnim.setValue(1);
      
      // Reset all practice-related state
      setPracticeLetters([]);
      setCurrentPracticeIndex(0);
      setGuess('');
      setLastResult(null);
      setPracticeMode(false);
      setPracticeType('');
      
      // Continue with the navigation after cleanup
      setTimeout(() => {
        navigation.dispatch(e.data.action);
      }, 0);
    });
    
    return () => {
      clearAllTimeouts();
      unsubscribe?.();
    };
  }, [navigation]);

  // Available speed options
  const speedOptions = [
    { label: '0.5X', value: 0.5 },
    { label: '1X', value: 1 },
    { label: '1.2X', value: 1.2 },
    { label: '1.5X', value: 1.5 },
    { label: '2X', value: 2 }
  ];

  // Filter mode options
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Letters', value: 'letters' },
    { label: 'Numbers', value: 'numbers' }
  ];

  // Calculate rotate interpolation
  const rotate = rotateAnim.interpolate({
    inputRange: [-0.05, 0, 0.05],
    outputRange: ['-5deg', '0deg', '5deg']
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, isSmallDevice && { fontSize: 18 }]}>Morse Code Trainer</Text>
            {!practiceMode && (
              <TouchableOpacity
                style={[styles.practiceButton, isSmallDevice && { paddingVertical: 5, paddingHorizontal: 10 }]}
                onPress={startPracticeMode}
              >
                <Text style={[styles.practiceButtonText, isSmallDevice && { fontSize: 12 }]}>Practice Mode</Text>
              </TouchableOpacity>
            )}
            {practiceMode && (
              <TouchableOpacity
                style={styles.practiceButton}
                onPress={exitPracticeMode}
              >
                <Text style={styles.practiceButtonText}>Exit Practice</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Interactive light display */}
          <View style={[styles.lightContainer, { height: isSmallDevice ? 80 : 110 }]}>
            <View style={[styles.morseVisualContainer, { height: isSmallDevice ? 20 : 30, marginBottom: isSmallDevice ? 8 : 15 }]}>
              {!practiceMode && getMorseVisual(getMorseCode(selectedLetter))}
              {practiceMode && practiceType && practiceLetters.length > 0 && currentPracticeIndex < practiceLetters.length && 
                getMorseVisual(getMorseCode(practiceLetters[currentPracticeIndex]))}
              
              {!practiceMode && (
                <Animated.View 
                  style={[
                    styles.movingLight,
                    isSmallDevice && { width: 12, height: 12, borderRadius: 6 },
                    { 
                      opacity: fadeAnim,
                      transform: [
                        { translateX: lightPosition.x },
                        { translateY: lightPosition.y },
                        { scale: Animated.add(1, Animated.multiply(fadeAnim, 0.3)) }
                      ]
                    }
                  ]}
                />
              )}
            </View>
            
            {!practiceMode && (
              <Animated.View 
                style={[
                  styles.light, 
                  { width: isSmallDevice ? 35 : 50, height: isSmallDevice ? 35 : 50, borderRadius: isSmallDevice ? 18 : 25 },
                  { 
                    opacity: fadeAnim,
                    transform: [
                      { scale: Animated.add(1, Animated.multiply(fadeAnim, 0.2)) }
                    ]
                  }
                ]}
              />
            )}
          </View>

          {/* Main content area - changes based on mode */}
          <View style={styles.mainContent}>
            {practiceMode ? (
              practiceType ? (
                <Animated.View 
                  style={[
                    styles.practiceContainer,
                    isSmallDevice && { padding: 10, marginBottom: 10 },
                    {
                      transform: [
                        { translateX: cardSlideAnim },
                        { scale: scaleAnim },
                        { rotate }
                      ]
                    }
                  ]}
                >
                  <Text style={[styles.practicePrompt, isSmallDevice && { fontSize: 14, marginBottom: 5 }]}>
                    What {practiceType === 'alphabet' ? 'letter' : 'number'} is this?{' '}
                    <Text style={[styles.practiceProgress, isSmallDevice && { fontSize: 11 }]}>
                      {currentPracticeIndex + 1}/{practiceLetters?.length || 0}
                    </Text>
                  </Text>
                  
                  {lastResult !== null && practiceLetters?.length > 0 && currentPracticeIndex < practiceLetters.length && (
                    <Text style={[
                      styles.resultText,
                      isSmallDevice && { fontSize: 12, padding: 4, marginTop: 3 },
                      lastResult ? styles.correctText : styles.incorrectText
                    ]}>
                      {lastResult 
                        ? `Correct! That was "${practiceLetters[currentPracticeIndex]}"` 
                        : `Incorrect. The answer was "${practiceLetters[currentPracticeIndex]}"`}
                    </Text>
                  )}
                  
                  <View style={[styles.guessButtonsContainer, isSmallDevice && { marginTop: 5, marginBottom: 5 }]}>
                    <View style={styles.guessButtonsWrapper}>
                      {practiceType === 'alphabet' 
                        ? Object.keys(morseCodeMap || {}).filter(key => /[A-Z]/.test(key)).map((letter) => (
                          <TouchableOpacity
                            key={letter}
                            style={[
                              styles.guessButton,
                              { width: isSmallDevice ? 30 : 40, height: isSmallDevice ? 30 : 40, margin: isSmallDevice ? 2 : 4 },
                              guess === letter && styles.selectedGuess
                            ]}
                            onPress={() => !lastResult && checkGuess(letter)}
                            disabled={lastResult !== null}
                          >
                            <Text style={[
                              styles.guessButtonText,
                              { fontSize: isSmallDevice ? 13 : 18 },
                              guess === letter && styles.selectedGuessText
                            ]}>
                              {letter}
                            </Text>
                          </TouchableOpacity>
                        ))
                        : Object.keys(morseCodeMap || {}).filter(key => /[0-9]/.test(key)).map((number) => (
                          <TouchableOpacity
                            key={number}
                            style={[
                              styles.guessButton,
                              { width: isSmallDevice ? 30 : 40, height: isSmallDevice ? 30 : 40, margin: isSmallDevice ? 2 : 4 },
                              guess === number && styles.selectedGuess
                            ]}
                            onPress={() => !lastResult && checkGuess(number)}
                            disabled={lastResult !== null}
                          >
                            <Text style={[
                              styles.guessButtonText,
                              { fontSize: isSmallDevice ? 13 : 18 },
                              guess === number && styles.selectedGuessText
                            ]}>
                              {number}
                            </Text>
                          </TouchableOpacity>
                        ))
                      }
                    </View>
                  </View>
                  
                  <View style={[styles.practiceControls, isSmallDevice && { marginTop: 5 }]}>
                    <TouchableOpacity
                      style={[
                        styles.exitPracticeButton,
                        isSmallDevice && { paddingVertical: 6, paddingHorizontal: 10, maxHeight: 34 }
                      ]}
                      onPress={exitPracticeMode}
                    >
                      <Text style={[styles.exitPracticeText, isSmallDevice && { fontSize: 11 }]}>Exit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.playButton, 
                        isSmallDevice && { paddingVertical: 6, paddingHorizontal: 10, maxHeight: 34 },
                        isPlaying ? styles.stopButton : null
                      ]}
                      onPress={togglePlay}
                    >
                      <Text style={[styles.playButtonText, isSmallDevice && { fontSize: 11 }]}>
                        {isPlaying ? 'Stop' : 'Play Again'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ) : (
                <View style={styles.practiceTypeSelection}>
                  <Text style={[styles.practiceTypeTitle, isSmallDevice && { fontSize: 16, marginBottom: 15 }]}>
                    Select Practice Type
                  </Text>
                  
                  <TouchableOpacity
                    style={[styles.practiceTypeButton, isSmallDevice && { padding: 12, marginBottom: 10 }]}
                    onPress={() => selectPracticeType('alphabet')}
                  >
                    <Text style={[styles.practiceTypeButtonText, isSmallDevice && { fontSize: 14 }]}>
                      Alphabet Practice
                    </Text>
                    <Text style={[styles.practiceTypeDescription, isSmallDevice && { fontSize: 11, marginTop: 3 }]}>
                      Practice letters A to Z
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.practiceTypeButton, isSmallDevice && { padding: 12, marginBottom: 10 }]}
                    onPress={() => selectPracticeType('numbers')}
                  >
                    <Text style={[styles.practiceTypeButtonText, isSmallDevice && { fontSize: 14 }]}>
                      Number Practice
                    </Text>
                    <Text style={[styles.practiceTypeDescription, isSmallDevice && { fontSize: 11, marginTop: 3 }]}>
                      Practice numbers 0 to 9
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.backButton, isSmallDevice && { paddingVertical: 10, marginTop: 10, maxWidth: 150 }]}
                    onPress={exitPracticeMode}
                  >
                    <Text style={[styles.backButtonText, isSmallDevice && { fontSize: 12 }]}>
                      Back to Trainer
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View style={styles.learningContainer}>
                {/* Speed controls */}
                <View style={[styles.speedSection, { padding: isSmallDevice ? 6 : 8, marginBottom: isSmallDevice ? 6 : 8 }]}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { fontSize: isSmallDevice ? 14 : 16 }]}>Speed:</Text>
                    <View style={styles.speedButtonsContainer}>
                      {speedOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.speedButton,
                            isSmallDevice && { paddingVertical: 3, paddingHorizontal: 6 },
                            speedMultiplier === option.value && styles.selectedSpeed
                          ]}
                          onPress={() => setSpeedMultiplier(option.value)}
                        >
                          <Text style={[
                            styles.speedButtonText,
                            isSmallDevice && { fontSize: 11 },
                            speedMultiplier === option.value && styles.selectedSpeedText
                          ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Combined Character Selection Section */}
                <View style={[styles.codeSection, { padding: isSmallDevice ? 6 : 10, marginBottom: isSmallDevice ? 6 : 10 }]}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { fontSize: isSmallDevice ? 14 : 16 }]}>Select Character:</Text>
                    
                    <View style={styles.filterButtonsContainer}>
                      {filterOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.filterButton,
                            isSmallDevice && { paddingVertical: 3, paddingHorizontal: 6 },
                            filterMode === option.value && styles.selectedFilter
                          ]}
                          onPress={() => setFilterMode(option.value)}
                        >
                          <Text style={[
                            styles.filterButtonText,
                            isSmallDevice && { fontSize: 11 },
                            filterMode === option.value && styles.selectedFilterText
                          ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.letterContainer}>
                    {getFilteredCharacters().map((letter) => (
                      <TouchableOpacity
                        key={letter}
                        style={[
                          styles.letterButton,
                          { width: isSmallDevice ? 28 : 38, height: isSmallDevice ? 28 : 38, margin: isSmallDevice ? 2 : 3 },
                          selectedLetter === letter && styles.selectedLetter
                        ]}
                        onPress={() => {
                          if (isPlaying) {
                            clearAllTimeouts();
                            fadeAnim.setValue(1);
                            setIsPlaying(false);
                          }
                          
                          // Reset light position
                          Animated.spring(lightPosition, {
                            toValue: { x: 0, y: 0 },
                            useNativeDriver: true,
                          }).start();
                          
                          setSelectedLetter(letter);
                        }}
                      >
                        <Text style={[
                          styles.letterText,
                          { fontSize: isSmallDevice ? 11 : 14 },
                          selectedLetter === letter && styles.selectedLetterText
                        ]}>
                          {letter}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={[styles.morseCodeTextLabel, { fontSize: isSmallDevice ? 10 : 12, marginTop: isSmallDevice ? 3 : 5 }]}>Morse Code:</Text>
                  <Text style={[styles.morseCodeText, { fontSize: isSmallDevice ? 16 : 20, marginTop: 2 }]}>{getMorseCode(selectedLetter)}</Text>
                </View>

                {/* Play/Stop button */}
                <TouchableOpacity
                  style={[
                    styles.playButton, 
                    { paddingVertical: isSmallDevice ? 7 : 10, marginTop: isSmallDevice ? 3 : 6 },
                    isPlaying ? styles.stopButton : null
                  ]}
                  onPress={togglePlay}
                >
                  <Text style={[styles.playButtonText, { fontSize: isSmallDevice ? 12 : 14 }]}>
                    {isPlaying ? 'Stop' : 'Play'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: isSmallDevice ? 10 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 15 : 20,
  },
  headerTitle: {
    fontSize: isSmallDevice ? 18 : 24,
    fontWeight: 'bold',
    color: '#333',
  },
  practiceButton: {
    backgroundColor: '#FF9800',
    paddingVertical: isSmallDevice ? 5 : 8,
    paddingHorizontal: isSmallDevice ? 10 : 15,
    borderRadius: 20,
  },
  practiceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isSmallDevice ? 12 : 14,
  },
  lightContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 15 : 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  light: {
    width: isSmallDevice ? 50 : 60,
    height: isSmallDevice ? 50 : 60,
    borderRadius: isSmallDevice ? 25 : 30,
    backgroundColor: '#E53935',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  morseVisualContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: isSmallDevice ? 25 : 30,
    marginBottom: isSmallDevice ? 20 : 30,
    position: 'relative',
  },
  morseVisual: {
    height: isSmallDevice ? 12 : 20,
    marginHorizontal: isSmallDevice ? 3 : 5,
    borderRadius: 2,
    backgroundColor: '#888',
  },
  morseDot: {
    width: isSmallDevice ? 12 : 20,
  },
  morseDash: {
    width: isSmallDevice ? 24 : 40,
  },
  movingLight: {
    position: 'absolute',
    width: isSmallDevice ? 12 : 20,
    height: isSmallDevice ? 12 : 20,
    borderRadius: isSmallDevice ? 6 : 10,
    backgroundColor: '#E53935',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  mainContent: {
    flex: 1,
  },
  learningContainer: {
    flex: 1,
  },
  speedSection: {
    backgroundColor: '#fff',
    padding: isSmallDevice ? 6 : 8, 
    borderRadius: 15,
    marginBottom: isSmallDevice ? 6 : 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  speedButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  speedButton: {
    paddingVertical: isSmallDevice ? 3 : 5,
    paddingHorizontal: isSmallDevice ? 6 : 8,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginLeft: 5,
  },
  selectedSpeed: {
    backgroundColor: '#4A90E2',
  },
  speedButtonText: {
    fontSize: isSmallDevice ? 11 : 14,
    fontWeight: 'bold',
  },
  selectedSpeedText: {
    color: '#fff',
  },
  codeSection: {
    backgroundColor: '#fff',
    padding: isSmallDevice ? 6 : 10,
    borderRadius: 15,
    marginBottom: isSmallDevice ? 6 : 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  letterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isSmallDevice ? 2 : 4,
    marginHorizontal: isSmallDevice ? -1 : 0,
  },
  letterButton: {
    width: isSmallDevice ? 28 : 38,
    height: isSmallDevice ? 28 : 38,
    justifyContent: 'center',
    alignItems: 'center',
    margin: isSmallDevice ? 2 : 3,
    borderRadius: isSmallDevice ? 14 : 19,
    backgroundColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedLetter: {
    backgroundColor: '#4A90E2',
  },
  letterText: {
    fontSize: isSmallDevice ? 11 : 14,
    fontWeight: 'bold',
  },
  selectedLetterText: {
    color: '#fff',
  },
  morseCodeDisplay: {
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 3,
  },
  morseCodeTextLabel: {
    fontSize: isSmallDevice ? 10 : 12,
    marginTop: isSmallDevice ? 3 : 5,
    color: '#666',
    textAlign: 'center',
  },
  morseCodeText: {
    fontSize: isSmallDevice ? 16 : 20,
    textAlign: 'center',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: isSmallDevice ? 2 : 3,
    color: '#333',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: isSmallDevice ? 7 : 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: isSmallDevice ? 3 : 6,
    marginBottom: isSmallDevice ? 5 : 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  playButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  playingMessageContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  playingText: {
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // Practice mode styles
  practiceContainer: {
    backgroundColor: '#fff',
    padding: isSmallDevice ? 10 : 20,
    borderRadius: 15,
    marginBottom: isSmallDevice ? 10 : 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  practicePrompt: {
    fontSize: isSmallDevice ? 14 : 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isSmallDevice ? 5 : 10,
    color: '#333',
  },
  practiceProgress: {
    fontSize: isSmallDevice ? 11 : 14,
    color: '#666',
  },
  guessButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: isSmallDevice ? 5 : 15,
    marginBottom: isSmallDevice ? 5 : 15,
  },
  guessButtonsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: isSmallDevice ? 0 : 5,
  },
  guessButton: {
    width: isSmallDevice ? 30 : 40,
    height: isSmallDevice ? 30 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: isSmallDevice ? 2 : 4,
    borderRadius: isSmallDevice ? 15 : 20,
    backgroundColor: '#e0e0e0',
    elevation: 2,
  },
  selectedGuess: {
    backgroundColor: '#4A90E2',
  },
  guessButtonText: {
    fontSize: isSmallDevice ? 13 : 18,
    fontWeight: 'bold',
  },
  selectedGuessText: {
    color: '#fff',
  },
  resultText: {
    fontSize: isSmallDevice ? 12 : 16,
    textAlign: 'center',
    marginTop: isSmallDevice ? 3 : 8,
    padding: isSmallDevice ? 4 : 8,
    borderRadius: 6,
  },
  correctText: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    color: '#2E7D32',
  },
  incorrectText: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    color: '#C62828',
  },
  practiceControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isSmallDevice ? 5 : 15,
  },
  exitPracticeButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: isSmallDevice ? 6 : 12,
    paddingHorizontal: isSmallDevice ? 10 : 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    maxHeight: isSmallDevice ? 34 : 45,
  },
  exitPracticeText: {
    color: '#fff',
    fontSize: isSmallDevice ? 11 : 14,
    fontWeight: 'bold',
  },
  practiceTypeSelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: isSmallDevice ? 12 : 20,
    elevation: 3,
  },
  practiceTypeTitle: {
    fontSize: isSmallDevice ? 16 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isSmallDevice ? 15 : 30,
    textAlign: 'center',
  },
  practiceTypeButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
    padding: isSmallDevice ? 12 : 20,
    borderRadius: 8,
    marginBottom: isSmallDevice ? 10 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  practiceTypeButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 14 : 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  practiceTypeDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: isSmallDevice ? 11 : 14,
    textAlign: 'center',
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 5 : 8,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  filterButton: {
    paddingVertical: isSmallDevice ? 3 : 5,
    paddingHorizontal: isSmallDevice ? 6 : 8,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginLeft: 5,
  },
  selectedFilter: {
    backgroundColor: '#4A90E2',
  },
  filterButtonText: {
    fontSize: isSmallDevice ? 11 : 14,
    fontWeight: 'bold',
  },
  selectedFilterText: {
    color: '#fff',
  },
  backButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: isSmallDevice ? 10 : 15,
    paddingHorizontal: isSmallDevice ? 15 : 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    maxWidth: 200,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
});

export default MorseCodeScreen;