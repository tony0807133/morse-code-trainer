import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Animated, 
  Dimensions, 
  Platform,
  SafeAreaView
} from 'react-native';

const { width } = Dimensions.get('window');

const ExamPatternScreen = ({ navigation }) => {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  // Start animations when the component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Data for cards to make it easier to map through
  const examInfoCards = [
    {
      id: 'overview',
      title: 'Exam Overview',
      content: 'Morse code proficiency is required for radio officers in the merchant Navy. While digital communication has largely replaced Morse, it remains a requirement in many maritime certificates.'
    },
    {
      id: 'speed',
      title: 'Speed Requirements',
      content: '• Receiving: 20 WPM (words per minute)\n• Sending: 16-20 WPM\n• Each word consists of 5 characters'
    },
    {
      id: 'format',
      title: 'Examination Format',
      content: '1. Reception Test:\n• 5-minute receiving test at 20 WPM\n• Text includes maritime communications\n• Minimum accuracy of 90% required\n\n2. Sending Test:\n• Transmission of maritime messages\n• Clear spacing and rhythm evaluated\n• Use of proper procedural signals\n\n3. Practical Knowledge:\n• Q-codes and procedural signals\n• Distress, urgency, and safety signals\n• International regulations',
      isDetailed: true
    },
    {
      id: 'qcodes',
      title: 'Important Q-Codes',
      content: '• QRZ - Who is calling me?\n• QRV - I am ready\n• QSA - Signal strength\n• QSO - Communication with (station)\n• QRQ - Send faster\n• QRS - Send slower\n• QRT - Stop transmission\n• QRU - I have nothing for you'
    },
    {
      id: 'signals',
      title: 'Special Signals',
      content: '• SOS (· · · — — — · · ·) - Distress signal\n• XXX (— · · — — · · — — · · —) - Urgency signal\n• TTT (—   —   —) - Safety signal'
    },
    {
      id: 'certification',
      title: 'Certification',
      content: 'Successful candidates receive a Maritime Radio Operator certificate, which is part of GMDSS (Global Maritime Distress and Safety System) certification.'
    },
  ];

  const renderCardWithAnimation = (card, index) => {
    const cardDelay = index * 100;
    const cardFade = React.useRef(new Animated.Value(0)).current;
    const cardSlide = React.useRef(new Animated.Value(50)).current;
    
    useEffect(() => {
      // Stagger the animations for each card
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardFade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cardSlide, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          })
        ]).start();
      }, cardDelay);
      
      return () => clearTimeout(timer);
    }, []);
    
    return (
      <Animated.View 
        key={card.id}
        style={[
          styles.infoCard,
          card.isDetailed && styles.detailedCard,
          { 
            opacity: cardFade,
            transform: [{ translateY: cardSlide }]
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.sectionHeader}>{card.title}</Text>
          <View style={styles.headerAccent} />
        </View>
        <Text style={styles.paragraph}>
          {card.content}
        </Text>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[
          styles.headerContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.title}>Merchant Navy</Text>
          <Text style={styles.subtitle}>Morse Code Examination</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>
        
        {examInfoCards.map(renderCardWithAnimation)}
        
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Return to Main Menu</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  titleUnderline: {
    height: 4,
    width: 100,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#3b82f6',
  },
  detailedCard: {
    paddingBottom: 24,
    borderLeftColor: '#8b5cf6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerAccent: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    marginLeft: 8,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExamPatternScreen; 