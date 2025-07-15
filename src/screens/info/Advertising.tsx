import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

const Advertising: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Advertising</h1>
      </header>

      <div className="policy-content">
        <section>
          <h2>Advertising on Morse Code Trainer</h2>
          <p>We use Google AdSense to display relevant advertisements on our platform. These ads help support our free educational services and maintain the platform's development.</p>
        </section>

        <section>
          <h2>About Google AdSense</h2>
          <p>Google AdSense is a program run by Google that allows publishers in the Google Network of content sites to serve automatic text, image, video, or interactive media advertisements.</p>
          <ul>
            <li>Ads are targeted to site content and audience</li>
            <li>Advertisements are clearly marked as "Sponsored" or "Advertisement"</li>
            <li>We follow all Google AdSense program policies and guidelines</li>
            <li>User privacy is maintained according to Google's privacy standards</li>
          </ul>
        </section>

        <section>
          <h2>Ad Placement</h2>
          <p>Advertisements may appear in the following locations:</p>
          <ul>
            <li>Header and footer areas</li>
            <li>Sidebar sections</li>
            <li>Between content sections</li>
            <li>Practice session intervals</li>
          </ul>
          <p>We carefully place ads to maintain a balance between monetization and user experience.</p>
        </section>

        <section>
          <h2>User Control</h2>
          <p>Users have several options regarding advertisements:</p>
          <ul>
            <li>Personalize ad preferences through Google Ad Settings</li>
            <li>Opt-out of personalized advertising</li>
            <li>Report inappropriate advertisements</li>
            <li>Use ad-blocking software (though we encourage supporting our platform)</li>
          </ul>
        </section>

        <section>
          <h2>Advertise With Us</h2>
          <p>For direct advertising opportunities or partnerships:</p>
          <ul>
            <li>Email: ts6140715@gmail.com</li>
            <li>Minimum campaign duration: 1 month</li>
            <li>Available formats: Banner ads, sponsored content</li>
            <li>Target audience: Morse code learners, radio enthusiasts, professionals</li>
          </ul>
        </section>

        <section>
          <h2>Ad Policy Compliance</h2>
          <p>All advertisements must comply with:</p>
          <ul>
            <li>Google AdSense Program Policies</li>
            <li>Local advertising laws and regulations</li>
            <li>Our content guidelines and ethical standards</li>
            <li>User privacy protection requirements</li>
          </ul>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>For advertising inquiries or concerns:</p>
          <p>Email: ts6140715@gmail.com</p>
          <button 
            className="contact-button"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </button>
        </section>
      </div>
    </div>
  );
};

export default Advertising; 