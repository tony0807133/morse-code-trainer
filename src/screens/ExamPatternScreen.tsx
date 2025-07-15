import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ExamPatternScreen.css';

interface ExamInfoCard {
  id: string;
  title: string;
  content: string;
  isDetailed?: boolean;
}

const examInfoCards: ExamInfoCard[] = [
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
  }
];

const ExamPatternScreen: React.FC = () => {
  const navigate = useNavigate();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize card refs array
    cardRefs.current = cardRefs.current.slice(0, examInfoCards.length);
    
    // Animate cards on mount
    cardRefs.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, []);

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  return (
    <div className="exam-pattern-screen">
      <header className="exam-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="header-content">
          <h1>Merchant Navy</h1>
          <h2>Morse Code Examination</h2>
          <div className="header-underline" />
        </div>
      </header>

      <div className="cards-container">
        {examInfoCards.map((card, index) => (
          <div
            key={card.id}
            ref={setCardRef(index)}
            className={`info-card ${card.isDetailed ? 'detailed' : ''}`}
          >
            <div className="card-header">
              <h3>{card.title}</h3>
              <div className="header-accent" />
            </div>
            <div className="card-content">
              {card.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="return-button" onClick={() => navigate('/')}>
        Return to Main Menu
      </button>
    </div>
  );
};

export default ExamPatternScreen; 