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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/morse-code" element={<MorseCodeScreen />} />
            <Route path="/exam-pattern" element={<ExamPatternScreen />} />
            <Route path="/quizzes" element={<QuizzesScreen />} />
            <Route path="/test" element={<TestScreen />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
