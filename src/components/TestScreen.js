import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  ScrollView,
  FlatList,
  BackHandler,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Custom hooks for better separation of concerns
const useMorseCodeDictionary = () => {
  const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  };

  const characterToMorse = useCallback((char) => {
    return morseCodeMap[char.toUpperCase()] || '';
  }, []);

  const stringToMorse = useCallback((str) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      if (i > 0) result += ' ';
      result += characterToMorse(str[i]);
    }
    return result;
  }, [characterToMorse]);

  return {
    morseCodeMap,
    characterToMorse,
    stringToMorse,
    characters: Object.keys(morseCodeMap)
  };
};

const useTimings = () => {
  // Standard Morse code timing units in milliseconds
  return {
    dotDuration: 250, // 1 time unit
    dashDuration: 750, // 3 time units
    elementGap: 250, // 1 time unit
    characterGap: 750, // 3 time units
    wordGap: 1750, // 7 time units
    itemPause: 2000 // 2 seconds pause between test items
  };
};

const useTimeoutManager = () => {
  const timeoutsRef = useRef([]);

  const addTimeout = useCallback((callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return clearAllTimeouts;
  }, [clearAllTimeouts]);

  return { addTimeout, clearAllTimeouts };
};

// Separated components for better organization
const TestIntroScreen = ({ onStartTest }) => (
  <View style={styles.darkContainer}>
    <StatusBar hidden />
    <Text style={styles.titleLight}>Morse Code Test</Text>
    <View style={styles.infoCardDark}>
      <Text style={styles.sectionHeaderLight}>Test Format</Text>
      <Text style={styles.paragraphLight}>
        • BLOCKS: 60 Marks - Single alpha-numeric codes (60 codes × 1 mark){'\n'}
        • GROUPS: 40 Marks - 8 Groups of alpha-numeric codes (8 groups × 5 marks){'\n'}
        • TOTAL: 100 Marks{'\n'}
        • PASSING MARKS: 70/100
      </Text>
    </View>
    <View style={styles.infoCardDark}>
      <Text style={styles.sectionHeaderLight}>Instructions</Text>
      <Text style={styles.paragraphLight}>
        1. A light will blink in Morse code pattern{'\n'}
        2. Write down each letter or number in your notebook{'\n'}
        3. For groups, write all 5 characters in sequence{'\n'}
        4. Standard timing will be used:{'\n'}
        {'   • Dot = 1 unit, Dash = 3 units'}{'\n'}
        {'   • Gap between elements = 1 unit'}{'\n'}
        {'   • Gap between characters = 3 units'}{'\n'}
        {'   • Gap between words/groups = 7 units'}{'\n'}
        5. All 68 items will be presented sequentially{'\n'}
        6. All answers will be shown at the end for scoring
      </Text>
    </View>
    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={onStartTest}
    >
      <Text style={styles.buttonTextLight}>Start Test</Text>
    </TouchableOpacity>
  </View>
);

const MorseLight = ({ isOn }) => (
  <View style={styles.blackBox}>
    <Animated.View 
      style={[
        styles.whiteLight, 
        { 
          opacity: isOn ? 1 : 0,
          backgroundColor: 'rgb(255, 255, 255)' 
        }
      ]}
    />
  </View>
);

const StatusIndicator = ({ 
  status, 
  itemIndex, 
  totalItems, 
  itemType, 
  isPause,
  speedChanged
}) => (
  <View style={styles.statusIndicator}>
    <Text style={styles.statusText}>
      {speedChanged ? 'Speed changed - restarting...' : status}
    </Text>
    <Text style={styles.itemCounter}>
      Item {itemIndex + 1} of {totalItems}
    </Text>
    <Text style={styles.itemType}>
      {itemType === 'single' ? 'Single Character' : 'Character Group'}
    </Text>
    {isPause && (
      <Text style={styles.pauseStatusText}>Wait For Next Block</Text>
    )}
  </View>
);

const ProgressBar = ({ value }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBackground}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
    </View>
    <Text style={styles.progressText}>{value}% Complete</Text>
  </View>
);

const BrightnessControl = ({ value, onChange }) => (
  <View style={styles.brightnessControl}>
    <Text style={styles.brightnessIcon}>☀️</Text>
    <TouchableOpacity 
      style={styles.brightnessBar}
      onPress={(e) => {
        const barWidth = 100;
        const tapPosition = e.nativeEvent.locationX;
        const newBrightness = Math.max(0.1, Math.min(1, tapPosition / barWidth));
        onChange(newBrightness);
      }}
    >
      <View style={[styles.brightnessLevel, { width: `${value * 100}%` }]} />
    </TouchableOpacity>
  </View>
);

const SpeedControl = ({ speedMultiplier, onSpeedChange }) => {
  const speedOptions = [
    { label: '0.5X', value: 0.5 },
    { label: '1X', value: 1 },
    { label: '1.2X', value: 1.2 },
    { label: '1.5X', value: 1.5 },
    { label: '2X', value: 2 }
  ];
  
  return (
    <View style={styles.speedControlContainer}>
      <Text style={styles.speedLabel}>Speed:</Text>
      <View style={styles.speedButtonsContainer}>
        {speedOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.speedButton,
              speedMultiplier === option.value && styles.selectedSpeed
            ]}
            onPress={() => onSpeedChange(option.value)}
          >
            <Text style={[
              styles.speedButtonText,
              speedMultiplier === option.value && styles.selectedSpeedText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const TestInProgressScreen = ({ 
  currentIndex, 
  testItems, 
  progress, 
  isPlaying, 
  lightOn, 
  onStopTest,
  speedMultiplier,
  onSpeedChange,
  speedChanged
}) => {
  const currentItem = testItems[currentIndex] || { type: 'loading' };
  const isPause = currentIndex > 0 && currentIndex % 6 === 0 && !isPlaying;
  
  return (
    <SafeAreaView style={styles.testContainer}>
      <StatusBar hidden />
      
      <StatusIndicator 
        status={isPlaying ? 'Transmitting...' : 'Preparing next...'}
        itemIndex={currentIndex}
        totalItems={testItems.length}
        itemType={currentItem.type}
        isPause={isPause}
        speedChanged={speedChanged}
      />
      
      <MorseLight isOn={lightOn} />
      
      <Text style={styles.lightStatus}>
        Light is {lightOn ? 'ON' : 'OFF'}
      </Text>
      
      <ProgressBar value={progress} />
      
      <SpeedControl
        speedMultiplier={speedMultiplier}
        onSpeedChange={onSpeedChange}
      />
      
      <TouchableOpacity 
        style={styles.stopButton}
        onPress={onStopTest}
      >
        <Text style={styles.stopButtonText}>Stop Test</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const AnswerItem = ({ item, index, characterToMorse, stringToMorse }) => (
  <View style={styles.answerItem}>
    <View style={styles.answerHeader}>
      <Text style={styles.answerNumber}>#{index + 1}</Text>
      <Text style={styles.answerType}>
        {item.type === 'single' ? 'Single (1pt)' : 'Group (5pts)'}
      </Text>
    </View>
    <View style={styles.answerContent}>
      <View style={styles.morseContainer}>
        <Text style={styles.morseLabel}>Morse:</Text>
        <Text style={styles.morseCode}>
          {item.type === 'single' ? 
            characterToMorse(item.value) : 
            stringToMorse(item.value).replace(/ /g, ' / ')}
        </Text>
      </View>
      <View style={styles.answerValue}>
        <Text style={styles.answerLabel}>Answer:</Text>
        <Text style={styles.answerText}>{item.value}</Text>
      </View>
    </View>
  </View>
);

const TestResultsScreen = ({ 
  testItems, 
  characterToMorse, 
  stringToMorse, 
  onNewTest, 
  onGoHome 
}) => {
  const scores = useMemo(() => {
    const singleItems = testItems.filter(item => item.type === 'single');
    const groupItems = testItems.filter(item => item.type === 'group');
    
    const singleCount = singleItems.length;
    const groupCount = groupItems.length;
    
    return {
      singles: singleCount,
      groups: groupCount,
      singlePoints: singleCount * 1,
      groupPoints: groupCount * 5,
      total: singleCount + (groupCount * 5)
    };
  }, [testItems]);

  const totalItems = testItems.length;
  const isPartialTest = totalItems < 68;
  
  return (
    <SafeAreaView style={styles.darkContainer}>
      <StatusBar hidden />
      <Text style={styles.titleLight}>Test {isPartialTest ? 'Stopped' : 'Completed'}</Text>
      
      <View style={styles.resultsCardDark}>
        <Text style={styles.resultHeaderLight}>
          Test Summary
        </Text>
        <View style={styles.resultSummary}>
          <Text style={styles.resultStatLight}>Single Characters: {scores.singles} × 1 = {scores.singlePoints} marks</Text>
          <Text style={styles.resultStatLight}>Character Groups: {scores.groups} × 5 = {scores.groupPoints} marks</Text>
          {isPartialTest && (
            <Text style={styles.resultNoteLight}>
              Test stopped after {totalItems} of 68 items
            </Text>
          )}
          <View style={styles.resultTotalContainer}>
            <Text style={styles.resultTotalLight}>Total: {scores.total}/{isPartialTest ? totalItems : 100}</Text>
            {!isPartialTest && (
              <Text style={[
                
              ]}>
                
              </Text>
            )}
          </View>
        </View>
      </View>
      
      <Text style={styles.answerSectionTitle}>Answer Key</Text>
      <Text style={styles.answerInstructions}>
        {isPartialTest 
          ? `Compare with your notes for the ${totalItems} items you attempted` 
          : 'Compare with your notes to calculate your score'}
      </Text>
      
      <FlatList
        data={testItems}
        keyExtractor={(item, index) => index.toString()}
        style={styles.answersList}
        renderItem={({ item, index }) => (
          <AnswerItem 
            item={item} 
            index={index} 
            characterToMorse={characterToMorse}
            stringToMorse={stringToMorse}
          />
        )}
      />
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={onNewTest}
        >
          <Text style={styles.buttonTextLight}>New Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.buttonPrimary, styles.buttonSecondary]}
          onPress={onGoHome}
        >
          <Text style={styles.buttonTextLight}>Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Main component
const TestScreen = ({ navigation }) => {
  // State
  const [testState, setTestState] = useState('notStarted'); // notStarted, inProgress, completed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [testItems, setTestItems] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [speedChanged, setSpeedChanged] = useState(false);
  
  // Use a ref to track the current speed to avoid closure issues
  const currentSpeedRef = useRef(1);
  
  // Update ref whenever speedMultiplier changes
  useEffect(() => {
    currentSpeedRef.current = speedMultiplier;
    console.log(`Speed ref updated to: ${currentSpeedRef.current}X`);
  }, [speedMultiplier]);
  
  // Custom hooks
  const { morseCodeMap, characterToMorse, stringToMorse, characters } = useMorseCodeDictionary();
  const timings = useTimings();
  const { addTimeout, clearAllTimeouts } = useTimeoutManager();

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Generate test items with singles first, then groups
  const generateTest = useCallback(() => {
    // For quick testing in dev mode
    if (__DEV__ && false) { // Disabled for now to generate full test
      return [
        { type: 'single', value: 'A', points: 1 },
        { type: 'single', value: 'B', points: 1 },
        { type: 'group', value: 'HELLO', points: 5 },
      ];
    }
    
    // 60 single characters
    const singleChars = Array(60).fill().map(() => ({
      type: 'single',
      value: characters[Math.floor(Math.random() * characters.length)],
      points: 1
    }));

    // 8 groups of 5 characters each
    const groups = Array(8).fill().map(() => {
      let groupValue = '';
      for (let i = 0; i < 5; i++) {
        groupValue += characters[Math.floor(Math.random() * characters.length)];
      }
      return {
        type: 'group',
        value: groupValue,
        points: 5
      };
    });

    // Return with singles first, then groups (no shuffling)
    return [...singleChars, ...groups];
  }, [characters]);

  // Toggle the light on or off
  const toggleLight = useCallback((on) => {
    setLightOn(on);
    fadeAnim.setValue(on ? 1 : 0);
  }, [fadeAnim]);

  // Handle back button to prevent accidental test exit
  useEffect(() => {
    const backAction = () => {
      if (testState === 'inProgress') {
        Alert.alert(
          "Exit Test?",
          "Are you sure you want to exit the test? All progress will be lost.",
          [
            { text: "Stay", style: "cancel", onPress: () => {} },
            { text: "Exit", style: "destructive", onPress: () => {
              clearAllTimeouts();
              navigation.goBack();
            }}
          ]
        );
        return true; // Prevent default back behavior
      }
      return false; // Let default back behavior happen
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, [testState, navigation, clearAllTimeouts]);

  // Play a specific item's Morse code
  const playItem = useCallback((index, items) => {
    try {
      if (!items || items.length === 0) {
        console.log('No items to play');
        return;
      }
      
      if (index >= items.length) {
        // We've played all items, show the results
        console.log('Test completed');
        setIsPlaying(false);
        setProgress(100);
        setTestState('completed');
        return;
      }

      // Update the UI to show which item we're on
      setCurrentIndex(index);
      const newProgress = Math.round(((index + 1) / items.length) * 100);
      setProgress(newProgress);
      
      // Add a pause after every 6 blocks
      if (index > 0 && index % 6 === 0) {
        // Show a pause message
        setIsPlaying(false);
        
        // Wait for 4-5 seconds before continuing
        const pauseTimeout = setTimeout(() => {
          if (index < items.length) {
            setIsPlaying(true);
            continuePlayingItem(index, items);
          }
        }, 5000); // 5 seconds pause
        
        addTimeout(() => {
          // This is a placeholder for the paused state
        }, 0);
        return;
      }
      
      continuePlayingItem(index, items);
    } catch (error) {
      console.error('Error playing item:', error);
      // Try to recover by moving to next item
      setTimeout(() => {
        try {
          playItem(index + 1, items);
        } catch (e) {
          console.error('Failed to recover:', e);
        }
      }, 1000);
    }
  }, [addTimeout, continuePlayingItem]);

  // Handle speed change
  const handleSpeedChange = useCallback((value) => {
    // Only apply change if speed is different
    if (value !== speedMultiplier) {
      // Log speed change for debugging
      console.log(`Speed changed from ${speedMultiplier}X to ${value}X`);
      
      // Update both state and ref immediately
      setSpeedMultiplier(value);
      currentSpeedRef.current = value;
      
      // If test is in progress, restart the current item with new speed
      if (testState === 'inProgress' && currentIndex < testItems.length) {
        // Clear existing timeouts to stop current playback
        clearAllTimeouts();
        
        // Briefly pause and show "Speed changed" message
        setIsPlaying(false);
        setSpeedChanged(true);
        
        // Schedule restart of current item with new speed after a short delay
        const timer = setTimeout(() => {
          setIsPlaying(true);
          setSpeedChanged(false);
          // Force integer index to avoid any floating point issues
          const safeIndex = Math.floor(currentIndex);
          playItem(safeIndex, testItems);
          
          // Debug log when playback resumes
          console.log(`Resuming playback at index ${safeIndex} with speed ${value}X (ref: ${currentSpeedRef.current}X)`);
        }, 300);
        
        // Ensure the timeout is properly tracked
        addTimeout(() => clearTimeout(timer), 600);
      }
    }
  }, [addTimeout, clearAllTimeouts, currentIndex, playItem, testItems, testState, speedMultiplier]);

  // Helper function to continue playing after pause
  const continuePlayingItem = useCallback((index, items) => {
    const item = items[index];
    if (!item) {
      console.log('Invalid item at index', index);
      return;
    }
    
    // IMPORTANT: Get speed from the ref to ensure we always use the latest value
    const usingSpeed = currentSpeedRef.current;
    console.log(`Playing item at index ${index} with speed ${usingSpeed}X (from ref)`);
    
    // Get the Morse code for this item
    const morseString = item.type === 'single' 
      ? characterToMorse(item.value) 
      : stringToMorse(item.value);
      
    if (!morseString) {
      console.log('Empty Morse code for item', item.value);
      // Skip to next item if this one has no Morse code
      setTimeout(() => playItem(index + 1, items), 1000);
      return;
    }
    
    let morseSequence = [];
    
    // Pre-calculate all timings based on current speed
    const adjustedTimings = {
      dotDuration: timings.dotDuration / usingSpeed,
      dashDuration: timings.dashDuration / usingSpeed,
      elementGap: timings.elementGap / usingSpeed,
      characterGap: timings.characterGap / usingSpeed,
      wordGap: timings.wordGap / usingSpeed,
      itemPause: timings.itemPause / usingSpeed
    };
    
    console.log(`Using speed ${usingSpeed}X - Adjusted dot: ${adjustedTimings.dotDuration}ms`);
    
    if (item.type === 'single') {
      // For a single character, convert the morse code to a sequence of on/off signals
      for (let i = 0; i < morseString.length; i++) {
        const char = morseString[i];
        // Add signal (on)
        morseSequence.push({ 
          on: true, 
          duration: char === '.' ? adjustedTimings.dotDuration : adjustedTimings.dashDuration 
        });
        // Add gap between elements (off)
        if (i < morseString.length - 1) {
          morseSequence.push({ on: false, duration: adjustedTimings.elementGap });
        }
      }
    } else {
      // For a group of characters
      const characters = morseString.split(' ');
      
      for (let charIndex = 0; charIndex < characters.length; charIndex++) {
        const character = characters[charIndex];
        
        for (let i = 0; i < character.length; i++) {
          const char = character[i];
          // Add signal (on)
          morseSequence.push({ 
            on: true, 
            duration: char === '.' ? adjustedTimings.dotDuration : adjustedTimings.dashDuration 
          });
          // Add gap between elements (off)
          if (i < character.length - 1) {
            morseSequence.push({ on: false, duration: adjustedTimings.elementGap });
          }
        }
        
        // Add gap between characters (off)
        if (charIndex < characters.length - 1) {
          morseSequence.push({ on: false, duration: adjustedTimings.characterGap });
        }
      }
    }
    
    // Debug log the sequence length
    console.log(`Morse sequence has ${morseSequence.length} elements to play`);
    
    // Start with light off
    toggleLight(false);
    
    // Play the morse sequence
    let totalDelay = 0;
    
    morseSequence.forEach((signal, i) => {
      addTimeout(() => {
        toggleLight(signal.on);
      }, totalDelay);
      
      totalDelay += signal.duration;
    });
    
    // Turn off the light at the end of the sequence
    addTimeout(() => {
      toggleLight(false);
    }, totalDelay);
    
    // Move to the next item after a pause
    addTimeout(() => {
      playItem(index + 1, items);
    }, totalDelay + adjustedTimings.itemPause);
  }, [addTimeout, characterToMorse, stringToMorse, timings, toggleLight]);

  // Start the test
  const startTest = useCallback(() => {
    try {
      // Clear any existing timeouts
      clearAllTimeouts();
      
      // Generate new test items
      const items = generateTest();
      
      // Reset and initialize state
      setTestItems(items);
      setCurrentIndex(0);
      setProgress(0);
      setTestState('inProgress');
      setIsPlaying(true);
      setLightOn(false);
      setSpeedMultiplier(1); // Reset speed to 1X when starting a new test
      
      // Use a short timeout to ensure state updates are applied
      setTimeout(() => {
        playItem(0, items);
      }, 300);
    } catch (error) {
      console.error('Error starting test:', error);
      Alert.alert('Error', 'Failed to start test: ' + error.message);
    }
  }, [clearAllTimeouts, generateTest, playItem]);

  // Handle stopping the test
  const handleStopTest = useCallback(() => {
    Alert.alert(
      "Stop Test?",
      "Are you sure you want to stop the test? Your progress until now will be saved.",
      [
        { text: "Continue Test", style: "cancel" },
        { 
          text: "Show Results", 
          style: "destructive", 
          onPress: () => {
            clearAllTimeouts();
            // Only keep attempted items
            const attemptedItems = testItems.slice(0, currentIndex + 1);
            setTestItems(attemptedItems);
            setIsPlaying(false);
            setTestState('completed');
          }
        }
      ]
    );
  }, [clearAllTimeouts, currentIndex, testItems]);

  // Handle new test
  const handleNewTest = useCallback(() => {
    clearAllTimeouts();
    setTestState('notStarted');
    setTestItems([]);
  }, [clearAllTimeouts]);

  // Handle going home
  const handleGoHome = useCallback(() => {
    try {
      clearAllTimeouts();
      if (navigation && navigation.navigate) {
        navigation.navigate('Home');
      } else if (navigation && navigation.goBack) {
        navigation.goBack();
      } else {
        setTestState('notStarted');
        setTestItems([]);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setTestState('notStarted');
      setTestItems([]);
    }
  }, [clearAllTimeouts, navigation]);

  // Render the appropriate screen based on the test state
  if (testState === 'notStarted') {
    return <TestIntroScreen onStartTest={startTest} />;
  }

  if (testState === 'inProgress') {
    return (
      <TestInProgressScreen 
        currentIndex={currentIndex}
        testItems={testItems}
        progress={progress}
        isPlaying={isPlaying}
        lightOn={lightOn}
        onStopTest={handleStopTest}
        speedMultiplier={speedMultiplier}
        onSpeedChange={handleSpeedChange}
        speedChanged={speedChanged}
      />
    );
  }

  if (testState === 'completed') {
    return (
      <TestResultsScreen 
        testItems={testItems}
        characterToMorse={characterToMorse}
        stringToMorse={stringToMorse}
        onNewTest={handleNewTest}
        onGoHome={handleGoHome}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  // Dark theme containers
  darkContainer: {
    flex: 1,
    backgroundColor: '#151515',
    padding: 20,
    paddingBottom: 40,
  },
  testContainer: {
    flex: 1,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Status indicator
  statusIndicator: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    color: '#ff5555',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemCounter: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 5,
  },
  itemType: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  debugText: {
    color: '#00ff00',
    fontSize: 12,
    marginBottom: 5,
  },
  lightStatus: {
    position: 'absolute',
    top: width * 0.55 + 80,
    color: '#ffffff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  // Black box with white light (main test screen)
  blackBox: {
    width: width * 0.55,
    height: width * 0.55,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  whiteLight: {
    width: 100,  // Much larger light for better visibility
    height: 100, // Much larger light for better visibility
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  // Progress indicator
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff5555',
    borderRadius: 5,
  },
  progressText: {
    color: '#aaa',
    fontSize: 14,
  },
  // Stop button
  stopButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 85, 85, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Text styles - light for dark mode
  titleLight: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#fff',
  },
  sectionHeaderLight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5555',
    marginBottom: 10,
  },
  paragraphLight: {
    fontSize: 15,
    lineHeight: 22,
    color: '#ddd',
  },
  // Dark mode cards
  infoCardDark: {
    backgroundColor: '#252525',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  resultsCardDark: {
    backgroundColor: '#252525',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // Dark mode buttons
  buttonPrimary: {
    backgroundColor: '#ff5555',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonSecondary: {
    backgroundColor: '#444',
  },
  buttonTextLight: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  // Results styles
  resultHeaderLight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultSummary: {
    width: '100%',
    alignItems: 'flex-start',
  },
  resultStatLight: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 8,
  },
  resultNoteLight: {
    fontSize: 16,
    color: '#ff9955',
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  resultTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 12,
    marginTop: 8,
  },
  resultTotalLight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultPassStatus: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  passColor: {
    color: '#4CAF50',
  },
  failColor: {
    color: '#ff5555',
  },
  // Answers section
  answerSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ddd',
    marginTop: 10,
    marginBottom: 5,
  },
  answerInstructions: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  // Answers list
  answersList: {
    flex: 1,
    width: '100%',
  },
  answerItem: {
    backgroundColor: '#252525',
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  answerNumber: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: 'bold',
  },
  answerType: {
    color: '#999',
    fontSize: 14,
  },
  answerContent: {
    marginTop: 5,
  },
  morseContainer: {
    marginBottom: 8,
  },
  morseLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 3,
  },
  morseCode: {
    color: '#ddd',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
  },
  answerValue: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 4,
  },
  answerLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 3,
  },
  answerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  speedControlContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  speedLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  speedButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  speedButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#444',
    marginHorizontal: 3,
  },
  selectedSpeed: {
    backgroundColor: '#4A90E2',
  },
  speedButtonText: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedSpeedText: {
    color: '#fff',
  },
  pauseStatusText: {
    color: '#4CAF50', // Green color for pause status
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestScreen; 