// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

import NavBar from './NavBar';
import Home from './Home';
import Auth from './Auth';
import Dashboard from './Dashboard';
import CreditEvaluation from './CreditEvaluation';
import FinancialLiteracy from './FinancialLiteracy';
import AlternativeFunding from './AlternativeFunding';
import FundingRequestDetail from './FundingRequestDetail';
import ForgotPasswordOTP from './ForgotPasswordOTP'; // or your forgot-password component
import Footer from './Footer';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  // Load user/token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle successful login/registration
  const handleAuthSuccess = (loggedInUser, authToken) => {
    setUser(loggedInUser);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <NavBar user={user} onLogout={handleLogout} />

        {/* 
          Add 'mb-5' to create extra space at the bottom 
          so content doesn't touch the footer.
        */}
        <div className="container flex-grow-1 mt-4 mb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/credit-evaluation" element={<CreditEvaluation />} />
            <Route path="/financial-literacy" element={<FinancialLiteracy />} />
            <Route path="/alternative-funding" element={<AlternativeFunding />} />
            
            <Route
              path="/auth"
              element={
                user ? <Navigate to="/dashboard" /> : <Auth onAuthSuccess={handleAuthSuccess} />
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? <Dashboard user={user} token={token} /> : <Navigate to="/auth" />
              }
            />
            <Route path="/funding/:id" element={<FundingRequestDetail />} />

            {/* Example of an OTP-based forgot-password route */}
            <Route path="/forgot-password" element={<ForgotPasswordOTP />} />

            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
