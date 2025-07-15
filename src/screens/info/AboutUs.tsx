import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>About Us</h1>
      </header>

      <div className="policy-content">
        <section>
          <h2>Our Mission</h2>
          <p>At Morse Code Trainer, we're dedicated to making Morse code learning accessible, engaging, and effective for everyone. Whether you're a beginner or looking to enhance your skills, our platform provides the tools and resources you need.</p>
        </section>

        <section>
          <h2>Who We Are</h2>
          <p>We are a team of passionate developers and Morse code enthusiasts who believe in preserving and promoting this historic form of communication. Our platform combines traditional learning methods with modern technology to create an engaging learning experience.</p>
        </section>

        <section>
          <h2>What We Offer</h2>
          <ul>
            <li>Interactive learning modules</li>
            <li>Professional certification preparation</li>
            <li>Practice quizzes and tests</li>
            <li>Real-time feedback and progress tracking</li>
            <li>Community support and resources</li>
          </ul>
        </section>

        <section>
          <h2>Our Values</h2>
          <ul>
            <li><strong>Accessibility:</strong> Making learning available to everyone</li>
            <li><strong>Innovation:</strong> Combining traditional methods with modern technology</li>
            <li><strong>Community:</strong> Building a supportive learning environment</li>
            <li><strong>Excellence:</strong> Providing high-quality educational content</li>
          </ul>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>We'd love to hear from you! Reach out to us at:</p>
          <p>Email: ts6140715@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 