import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
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
    description: 'Begin your Morse code journey',
    route: '/morse-code',
    color: '#4A90E2'
  },
  {
    title: 'Exam Pattern',
    icon: '−•−•',
    description: 'Learn official Morse code patterns',
    route: '/exam-pattern',
    color: '#43A047'
  },
  {
    title: 'Test',
    icon: '−',
    description: 'Test your Morse code knowledge',
    route: '/test',
    color: '#E53935'
  },
  {
    title: 'Quizzes',
    icon: '−−•',
    description: 'Challenge yourself with quizzes',
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
      
      <div className="header">
        <h1 className="title">Morse Code Trainer</h1>
        <div className="divider" />
        <p className="description">
          Master the art of Morse code through interactive exercises, quizzes and challenges
        </p>
      </div>

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
              <h2 className="menu-title">{option.title}</h2>
              <p className="menu-description">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen; 