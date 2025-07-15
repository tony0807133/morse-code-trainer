import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Terms of Service</h1>
      </header>

      <div className="policy-content">
        <section>
          <h2>Agreement to Terms</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>By accessing and using Morse Code Trainer, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section>
          <h2>Use License</h2>
          <p>Permission is granted to temporarily access the materials (information or software) on Morse Code Trainer for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2>Disclaimer</h2>
          <p>The materials on Morse Code Trainer are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation:</p>
          <ul>
            <li>Implied warranties or conditions of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement of intellectual property or other violation of rights</li>
          </ul>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>For any questions about these Terms of Service, please contact us at:</p>
          <p>Email: ts6140715@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 