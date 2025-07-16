import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import '../styles/HomeScreen.css';

interface MenuOption {
  title: string;
  icon: string;
  description: string;
  route: string;
  color: string;
}

const menuOptions: MenuOption[] = [
  {
    title: 'Start Learning',
    icon: '•−',
    description: 'Interactive lessons for beginners to advanced users',
    route: '/morse-code',
    color: '#4A90E2'
  },
  {
    title: 'Exam Pattern',
    icon: '−•−•',
    description: 'Professional certification preparation',
    route: '/exam-pattern',
    color: '#43A047'
  },
  {
    title: 'Test Your Skills',
    icon: '−',
    description: 'Challenge yourself with real-time tests',
    route: '/test',
    color: '#E53935'
  },
  {
    title: 'Practice Quizzes',
    icon: '−−•',
    description: 'Fun and engaging morse code exercises',
    route: '/quizzes',
    color: '#FF9800'
  }
];

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="home-container">
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Morse Code
            <span className="hero-subtitle">Interactive & Fun</span>
          </h1>
          <p className="hero-description">
            Learn, practice, and master Morse code through our comprehensive platform.
            Perfect for beginners and professionals alike.
          </p>
          <button className="cta-button" onClick={() => navigate('/morse-code')}>
            Start Learning Now
          </button>
        </div>
      </section>

      {/* Main Menu Section */}
      <section className="menu-section">
        <h2 className="section-title">Start Your Journey</h2>
        <div className="menu-grid">
          {menuOptions.map((option, index) => (
            <div
              key={option.title}
              className="menu-item"
              style={{ 
                '--delay': `${index * 0.15}s`,
                '--color': option.color
              } as React.CSSProperties}
              onClick={() => navigate(option.route)}
            >
              <div className="menu-content">
                <div className="menu-icon">{option.icon}</div>
                <h3 className="menu-title">{option.title}</h3>
                <p className="menu-description">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Begin?</h2>
          <p>Join thousands of learners mastering Morse code today.</p>
          <button className="cta-button" onClick={() => navigate('/morse-code')}>
            Get Started
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeScreen; 