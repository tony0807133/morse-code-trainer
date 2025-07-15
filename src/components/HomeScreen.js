import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Morse code dictionary for the header animation
const morseCodeMap = {
  'M': '--', 'O': '---', 'R': '.-.', 'S': '...', 'E': '.'
};

// Menu options definition moved here before it's used
const menuOptions = [
  {
    title: 'Start Learning',
    icon: '•−',
    description: 'Begin your Morse code journey',
    screen: 'MorseCode',
    color: '#4A90E2'
  },
  {
    title: 'Exam Pattern',
    icon: '−•−•',
    description: 'Learn official Morse code patterns',
    screen: 'ExamPattern',
    color: '#43A047'
  },
  {
    title: 'Test',
    icon: '−',
    description: 'Test your Morse code knowledge',
    screen: 'Test',
    color: '#E53935'
  },
  {
    title: 'Quizzes',
    icon: '−−•',
    description: 'Challenge yourself with quizzes',
    screen: 'Quizzes',
    color: '#FF9800'
  }
];

const HomeScreen = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Menu item animations (individual for staggered effect)
  const menuAnims = useRef(menuOptions.map(() => new Animated.Value(0))).current;
  
  // Morse code light animation
  const [morseAnimating, setMorseAnimating] = useState(true);
  const morseCode = "-- --- .-. ... ."; // MORSE in morse code
  const morseLight = useRef(new Animated.Value(0)).current;
  
  // Start animations when component mounts
  useEffect(() => {
    // Header animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    // Menu items staggered animation
    menuAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 700 + (index * 150),
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5))
      }).start();
    });

    // Start the pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
    
    // Start the Morse code light animation
    animateMorseLight();
  }, []);
  
  // Function to animate the Morse code light
  const animateMorseLight = () => {
    if (!morseAnimating) return;
    
    const animations = [];
    let delay = 0;
    
    // Create animation sequence from the Morse code
    for (let i = 0; i < morseCode.length; i++) {
      const char = morseCode[i];
      
      if (char === '.') {
        // Dot - short blink
        animations.push(
          Animated.timing(morseLight, {
            toValue: 1,
            duration: 100,
            delay: delay,
            useNativeDriver: true
          })
        );
        delay += 100;
        
        animations.push(
          Animated.timing(morseLight, {
            toValue: 0,
            duration: 100,
            delay: 0,
            useNativeDriver: true
          })
        );
        delay += 100;
      } 
      else if (char === '-') {
        // Dash - long blink
        animations.push(
          Animated.timing(morseLight, {
            toValue: 1,
            duration: 300,
            delay: delay,
            useNativeDriver: true
          })
        );
        delay += 300;
        
        animations.push(
          Animated.timing(morseLight, {
            toValue: 0,
            duration: 100,
            delay: 0,
            useNativeDriver: true
          })
        );
        delay += 100;
      }
      else if (char === ' ') {
        // Space between letters
        delay += 300;
      }
    }
    
    // Run the sequence and then restart
    Animated.sequence(animations).start(() => {
      // Wait before restarting the animation
      setTimeout(() => {
        animateMorseLight();
      }, 1500);
    });
  };

  // For button press animation
  const animatePress = (index) => {
    Animated.sequence([
      Animated.timing(menuAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(menuAnims[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Morse code blinking light */}
          <Animated.View style={[
            styles.morseLight,
            {
              opacity: morseLight,
              transform: [{ scale: Animated.add(1, Animated.multiply(morseLight, 0.2)) }]
            }
          ]} />
          
          {/* Header with animated title */}
          <Animated.View style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}>
            <Text style={styles.title}>Morse Code Trainer</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.description}>
              Master the art of Morse code through interactive exercises, quizzes and challenges
            </Text>
          </Animated.View>

          {/* Menu Grid */}
          <View style={styles.menuGrid}>
            {menuOptions.map((option, index) => {
              // Calculate staggered entrance animation
              const translateY = menuAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              });
              
              const opacity = menuAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              });
              
              const scale = menuAnims[index].interpolate({
                inputRange: [0, 0.95, 1],
                outputRange: [0, 0.95, 1]
              });
              
              return (
                <Animated.View 
                  key={option.title}
                  style={[
                    styles.menuItem,
                    { 
                      opacity: opacity,
                      transform: [
                        { translateY: translateY },
                        { scale: index === 0 ? pulseAnim : scale }
                      ]
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.menuButton, { backgroundColor: option.color }]}
                    onPress={() => {
                      animatePress(index);
                      setTimeout(() => navigation.navigate(option.screen), 150);
                    }}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.menuIcon}>{option.icon}</Text>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>{option.title}</Text>
                      <Text style={styles.menuDescription} numberOfLines={2}>
                        {option.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Footer */}
          <Animated.View 
            style={[
              styles.footer,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8]
                }),
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}
          >
            <Text style={styles.footerText}>Learn at your own pace</Text>
          </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: '#4A90E2',
    marginVertical: 10,
    borderRadius: 2,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    lineHeight: 22,
  },
  menuGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  menuItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 15,
    borderRadius: 12,
    height: 140,
    justifyContent: 'space-between',
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  menuTextContainer: {
    marginTop: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 16,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 15,
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
  morseLight: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E53935',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  }
});

export default HomeScreen; 