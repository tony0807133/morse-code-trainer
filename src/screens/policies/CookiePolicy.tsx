import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Cookie Policy</h1>
      </header>

      <div className="policy-content">
        <section>
          <h2>Introduction</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This Cookie Policy explains how Morse Code Trainer uses cookies and similar technologies to recognize you when you visit our website.</p>
        </section>

        <section>
          <h2>What are Cookies?</h2>
          <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide reporting information.</p>
        </section>

        <section>
          <h2>How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li>Essential cookies: Required for the website to function properly</li>
            <li>Preference cookies: Remember your settings and preferences</li>
            <li>Analytics cookies: Help us understand how visitors interact with our website</li>
            <li>Performance cookies: Help us improve website performance and reliability</li>
          </ul>
        </section>

        <section>
          <h2>Your Cookie Choices</h2>
          <p>Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect the functionality of our website.</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>For any questions about our Cookie Policy, please contact us at:</p>
          <p>Email: ts6140715@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy; 