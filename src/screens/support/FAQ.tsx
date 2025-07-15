import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Morse code?",
    answer: "Morse code is a method of encoding text characters using sequences of dots and dashes, or short and long signals. It was developed by Samuel Morse and Alfred Vail in the 1830s for use in telegraphy."
  },
  {
    question: "How long does it take to learn Morse code?",
    answer: "Learning time varies by individual, but with regular practice using our platform, basic proficiency can be achieved in 4-8 weeks. Our structured lessons and practice sessions are designed to optimize your learning speed."
  },
  {
    question: "Do I need any special equipment?",
    answer: "No special equipment is needed! Our web-based platform works on any modern device with a web browser. We provide audio and visual tools for learning and practicing Morse code."
  },
  {
    question: "Is Morse code still useful today?",
    answer: "Yes! Morse code is still used in aviation, amateur radio, and as a backup communication method. It's also valuable for accessibility purposes and emergency situations where other forms of communication might not be available."
  },
  {
    question: "How does the certification process work?",
    answer: "Our platform prepares you for official Morse code certifications through structured lessons and practice tests. While we don't issue official certificates, our content aligns with international standards."
  },
  {
    question: "Can I practice offline?",
    answer: "While our platform requires an internet connection for full functionality, we provide downloadable practice sheets and reference materials that can be used offline."
  },
  {
    question: "What speed should I aim for?",
    answer: "Beginners typically start at 5 words per minute (WPM). Professional standards often require 20-25 WPM. Our platform allows you to adjust speed and gradually increase it as you improve."
  },
  {
    question: "How accurate is your Morse code converter?",
    answer: "Our Morse code converter follows international standards and is regularly updated. It supports both American and International Morse code variants with high accuracy."
  }
];

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Frequently Asked Questions</h1>
      </header>

      <div className="policy-content">
        <section className="faq-intro">
          <h2>Common Questions About Morse Code Training</h2>
          <p>Find answers to the most frequently asked questions about our platform and Morse code learning.</p>
        </section>

        <section className="faq-list">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className={`faq-item ${expandedIndex === index ? 'expanded' : ''}`}
              onClick={() => toggleQuestion(index)}
            >
              <div className="faq-question">
                <h3>{item.question}</h3>
                <span className="faq-toggle">
                  {expandedIndex === index ? '−' : '+'}
                </span>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="faq-contact">
          <h2>Still Have Questions?</h2>
          <p>If you couldn't find the answer you were looking for, please don't hesitate to contact us.</p>
          <button 
            className="contact-button"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </button>
        </section>
      </div>
    </div>
  );
};

export default FAQ; 