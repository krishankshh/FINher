import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import Home from './Home';
import Auth from './Auth';
import Dashboard from './Dashboard';
import CreditEvaluation from './CreditEvaluation';
import FinancialLiteracy from './FinancialLiteracy';
import AlternativeFunding from './AlternativeFunding';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  // Retrieve persisted login info from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Called when authentication (login) is successful
  const handleAuthSuccess = (loggedInUser, authToken) => {
    setUser(loggedInUser);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  // Logout: clear state and localStorage
  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="container mt-4">
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
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
