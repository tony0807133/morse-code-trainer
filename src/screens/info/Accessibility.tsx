import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

const Accessibility: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Accessibility</h1>
      </header>

      <div className="policy-content">
        <section>
          <h2>Our Commitment</h2>
          <p>Morse Code Trainer is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>
        </section>

        <section>
          <h2>Accessibility Features</h2>
          <ul>
            <li><strong>Keyboard Navigation:</strong> Full keyboard support for all features</li>
            <li><strong>Screen Reader Support:</strong> Compatible with popular screen readers</li>
            <li><strong>Color Contrast:</strong> WCAG 2.1 compliant color contrast ratios</li>
            <li><strong>Text Scaling:</strong> Support for browser text scaling</li>
            <li><strong>Dark Mode:</strong> Reduced eye strain with dark theme option</li>
            <li><strong>Audio Feedback:</strong> Clear audio signals for Morse code learning</li>
            <li><strong>Visual Indicators:</strong> Clear visual feedback for all interactions</li>
          </ul>
        </section>

        <section>
          <h2>Standards</h2>
          <p>We aim to meet WCAG 2.1 Level AA standards and follow these principles:</p>
          <ul>
            <li><strong>Perceivable:</strong> Information must be presentable to users in ways they can perceive</li>
            <li><strong>Operable:</strong> User interface components must be operable</li>
            <li><strong>Understandable:</strong> Information and operation must be understandable</li>
            <li><strong>Robust:</strong> Content must be robust enough to be interpreted by a wide variety of user agents</li>
          </ul>
        </section>

        <section>
          <h2>Assistive Technologies</h2>
          <p>Our platform is tested with various assistive technologies including:</p>
          <ul>
            <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
            <li>Speech recognition software</li>
            <li>Screen magnification tools</li>
            <li>Alternative input devices</li>
          </ul>
        </section>

        <section>
          <h2>Feedback and Support</h2>
          <p>We welcome your feedback on the accessibility of our platform. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:</p>
          <p>Email: ts6140715@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default Accessibility; 