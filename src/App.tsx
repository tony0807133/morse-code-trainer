import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Import screens
import HomeScreen from './screens/HomeScreen';
import MorseCodeScreen from './screens/MorseCodeScreen';
import ExamPatternScreen from './screens/ExamPatternScreen';
import QuizzesScreen from './screens/QuizzesScreen';
import TestScreen from './screens/TestScreen';

// Import policy pages
import PrivacyPolicy from './screens/policies/PrivacyPolicy';
import TermsOfService from './screens/policies/TermsOfService';
import CookiePolicy from './screens/policies/CookiePolicy';
import Disclaimer from './screens/policies/Disclaimer';

// Import info pages
import AboutUs from './screens/info/AboutUs';
import ContactUs from './screens/info/ContactUs';
import Accessibility from './screens/info/Accessibility';
import Advertising from './screens/info/Advertising';

// Import support pages
import FAQ from './screens/support/FAQ';
import HelpCenter from './screens/support/HelpCenter';
import Feedback from './screens/support/Feedback';
import ReportIssue from './screens/support/ReportIssue';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/morse-code" element={<MorseCodeScreen />} />
            <Route path="/exam-pattern" element={<ExamPatternScreen />} />
            <Route path="/quizzes" element={<QuizzesScreen />} />
            <Route path="/test" element={<TestScreen />} />
            
            {/* Policy Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />

            {/* Info Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/advertising" element={<Advertising />} />

            {/* Support Routes */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/report" element={<ReportIssue />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
