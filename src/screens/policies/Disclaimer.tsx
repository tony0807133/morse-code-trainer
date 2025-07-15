import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

const Disclaimer: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Disclaimer</h1>
      </header>

      <div className="policy-content">
        <section>
          <h2>General Disclaimer</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>The information provided by Morse Code Trainer ("we," "us," or "our") on our website is for general informational and educational purposes only. All information is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on our website.</p>
        </section>

        <section>
          <h2>No Professional Advice</h2>
          <p>The content on our website is not intended to be a substitute for professional advice. Users should not take or refrain from taking any action based on any information on our website. Before you make any decisions or take any actions that might affect your practice of Morse code in professional settings, you should consult with qualified professionals in your area.</p>
        </section>

        <section>
          <h2>External Links Disclaimer</h2>
          <p>Our website may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>
        </section>

        <section>
          <h2>Advertising Disclaimer</h2>
          <p>Our website displays advertisements through Google AdSense. These ads are:</p>
          <ul>
            <li>Clearly marked as advertisements</li>
            <li>Selected and delivered by Google</li>
            <li>Subject to Google AdSense policies</li>
            <li>Not endorsed by Morse Code Trainer</li>
          </ul>
          <p>We are not responsible for the content of these advertisements or any products or services they may offer.</p>
        </section>

        <section>
          <h2>Errors and Omissions Disclaimer</h2>
          <p>While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information contained on the website for any purpose.</p>
        </section>

        <section>
          <h2>Fair Use Disclaimer</h2>
          <p>This website may use copyrighted material which has not always been specifically authorized by the copyright owner. We are making such material available for criticism, comment, news reporting, teaching, scholarship, or research. We believe this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the US Copyright Law.</p>
        </section>

        <section>
          <h2>"As Is" and "As Available" Disclaimer</h2>
          <p>The website is provided "as is" and "as available" without any representations or warranties, expressed or implied. You are using the website at your own risk.</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>If you have any questions about this Disclaimer, please contact us:</p>
          <p>Email: ts6140715@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default Disclaimer; 