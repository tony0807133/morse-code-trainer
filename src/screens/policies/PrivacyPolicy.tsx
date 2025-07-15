import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Privacy Policy</h1>
      </header>

      <div className="policy-content">
        <section>
          <h2>Introduction</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Welcome to Morse Code Trainer. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website.</p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Account information (if you create an account)</li>
            <li>Usage data and preferences</li>
            <li>Communication data when you contact us</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about updates and changes</li>
            <li>Monitor and analyze usage patterns</li>
          </ul>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>For any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: ts6140715@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 