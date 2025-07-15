import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

interface FeedbackForm {
  type: string;
  rating: number;
  title: string;
  description: string;
  email: string;
}

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FeedbackForm>({
    type: '',
    rating: 0,
    title: '',
    description: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    setFormData({
      type: '',
      rating: 0,
      title: '',
      description: '',
      email: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Share Your Feedback</h1>
      </header>

      <div className="policy-content">
        <section className="feedback-intro">
          <h2>Help Us Improve</h2>
          <p>Your feedback is valuable in making Morse Code Trainer better for everyone. Share your thoughts, suggestions, or report issues.</p>
        </section>

        {submitted ? (
          <section className="feedback-success">
            <h2>Thank You for Your Feedback!</h2>
            <p>We appreciate you taking the time to help us improve.</p>
            <button 
              className="new-feedback-button"
              onClick={() => setSubmitted(false)}
            >
              Submit Another Feedback
            </button>
          </section>
        ) : (
          <section className="feedback-form-section">
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="type">Feedback Type:</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select feedback type</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="praise">Praise</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>How would you rate your experience?</label>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`rating-button ${formData.rating === rating ? 'active' : ''}`}
                      onClick={() => handleRatingClick(rating)}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide detailed feedback..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (optional):</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="For follow-up questions"
                />
              </div>

              <button type="submit" className="submit-button">
                Submit Feedback
              </button>
            </form>
          </section>
        )}

        <section className="feedback-note">
          <h3>Note</h3>
          <p>Your feedback helps us improve Morse Code Trainer. While we may not respond to every submission, we read and consider all feedback carefully.</p>
          <p>For urgent issues or support requests, please use our <button className="link-button" onClick={() => navigate('/contact')}>Contact Form</button>.</p>
        </section>
      </div>
    </div>
  );
};

export default Feedback; 