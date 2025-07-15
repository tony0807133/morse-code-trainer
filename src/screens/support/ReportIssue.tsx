import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/PolicyPages.css';

interface IssueReport {
  type: string;
  title: string;
  description: string;
  browser: string;
  device: string;
  steps: string;
  expectedBehavior: string;
  actualBehavior: string;
  email: string;
  attachments: FileList | null;
}

const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<IssueReport>({
    type: '',
    title: '',
    description: '',
    browser: '',
    device: '',
    steps: '',
    expectedBehavior: '',
    actualBehavior: '',
    email: '',
    attachments: null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Issue reported:', formData);
    setSubmitted(true);
    // Reset form
    setFormData({
      type: '',
      title: '',
      description: '',
      browser: '',
      device: '',
      steps: '',
      expectedBehavior: '',
      actualBehavior: '',
      email: '',
      attachments: null
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: e.target.files
      }));
    }
  };

  return (
    <div className={`policy-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="policy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Report an Issue</h1>
      </header>

      <div className="policy-content">
        <section className="report-intro">
          <h2>Help Us Improve</h2>
          <p>Found a bug or experiencing an issue? Please help us by providing detailed information about the problem.</p>
        </section>

        {submitted ? (
          <section className="report-success">
            <h2>Thank You for Your Report!</h2>
            <p>We've received your issue report and will investigate it promptly.</p>
            <button 
              className="new-report-button"
              onClick={() => setSubmitted(false)}
            >
              Report Another Issue
            </button>
          </section>
        ) : (
          <section className="report-form-section">
            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label htmlFor="type">Issue Type:</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="bug">Bug/Error</option>
                  <option value="performance">Performance Issue</option>
                  <option value="ui">UI/Display Problem</option>
                  <option value="audio">Audio Problem</option>
                  <option value="advertisement">Advertisement Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title">Issue Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief summary of the issue"
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
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="browser">Browser:</label>
                  <input
                    type="text"
                    id="browser"
                    name="browser"
                    value={formData.browser}
                    onChange={handleChange}
                    placeholder="e.g., Chrome 91.0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="device">Device:</label>
                  <input
                    type="text"
                    id="device"
                    name="device"
                    value={formData.device}
                    onChange={handleChange}
                    placeholder="e.g., Desktop, iPhone 12"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="steps">Steps to Reproduce:</label>
                <textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  placeholder="1. First step&#10;2. Second step&#10;3. ..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="expectedBehavior">Expected Behavior:</label>
                <textarea
                  id="expectedBehavior"
                  name="expectedBehavior"
                  value={formData.expectedBehavior}
                  onChange={handleChange}
                  placeholder="What should have happened?"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="actualBehavior">Actual Behavior:</label>
                <textarea
                  id="actualBehavior"
                  name="actualBehavior"
                  value={formData.actualBehavior}
                  onChange={handleChange}
                  placeholder="What actually happened?"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="attachments">Attachments (optional):</label>
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf,.txt"
                />
                <small>You can attach screenshots, logs, or other relevant files</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (for updates):</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Submit Report
              </button>
            </form>
          </section>
        )}

        <section className="report-note">
          <h3>Before Submitting</h3>
          <ul>
            <li>Check if the issue persists after clearing your browser cache</li>
            <li>Ensure you're using a supported browser version</li>
            <li>Check your internet connection</li>
            <li>Review our <button className="link-button" onClick={() => navigate('/faq')}>FAQ</button> for common issues</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ReportIssue; 