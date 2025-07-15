import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

interface HelpCategory {
  title: string;
  description: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  title: string;
  preview: string;
  link: string;
}

const helpCategories: HelpCategory[] = [
  {
    title: "Getting Started",
    description: "Learn the basics of using Morse Code Trainer",
    articles: [
      {
        title: "Creating Your Account",
        preview: "Learn how to set up your account and personalize your learning experience.",
        link: "/help/account-setup"
      },
      {
        title: "Basic Navigation Guide",
        preview: "Understanding the platform's interface and main features.",
        link: "/help/navigation"
      },
      {
        title: "First Learning Session",
        preview: "How to start your first Morse code learning session.",
        link: "/help/first-lesson"
      }
    ]
  },
  {
    title: "Learning Methods",
    description: "Different approaches to learning Morse code",
    articles: [
      {
        title: "Interactive Lessons",
        preview: "How to make the most of our interactive learning system.",
        link: "/help/interactive-lessons"
      },
      {
        title: "Practice Techniques",
        preview: "Effective methods for practicing Morse code.",
        link: "/help/practice-techniques"
      },
      {
        title: "Speed Building",
        preview: "Tips for increasing your Morse code speed.",
        link: "/help/speed-building"
      }
    ]
  },
  {
    title: "Technical Support",
    description: "Solutions for technical issues",
    articles: [
      {
        title: "Audio Problems",
        preview: "Troubleshooting common audio playback issues.",
        link: "/help/audio-issues"
      },
      {
        title: "Browser Compatibility",
        preview: "Supported browsers and optimization tips.",
        link: "/help/browser-support"
      },
      {
        title: "Performance Issues",
        preview: "How to improve the app's performance on your device.",
        link: "/help/performance"
      }
    ]
  }
];

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Help Center</h1>
      </header>

      <div className="policy-content">
        <section className="help-intro">
          <h2>How can we help you?</h2>
          <p>Browse through our help articles or contact our support team for assistance.</p>
          <div className="help-actions">
            <button className="contact-button" onClick={() => navigate('/contact')}>
              Contact Support
            </button>
            <button className="faq-button" onClick={() => navigate('/faq')}>
              View FAQs
            </button>
          </div>
        </section>

        {helpCategories.map((category, index) => (
          <section key={index} className="help-category">
            <h2>{category.title}</h2>
            <p className="category-description">{category.description}</p>
            
            <div className="article-grid">
              {category.articles.map((article, articleIndex) => (
                <div key={articleIndex} className="article-card" onClick={() => navigate(article.link)}>
                  <h3>{article.title}</h3>
                  <p>{article.preview}</p>
                  <span className="read-more">Read More →</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="help-contact">
          <h2>Need More Help?</h2>
          <p>Our support team is available to assist you with any questions or issues you may have.</p>
          <p>Email: ts6140715@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter; 