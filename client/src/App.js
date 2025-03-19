// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from './NavBar';
import Home from './Home';
import Auth from './Auth';
import Dashboard from './Dashboard';
import CreditEvaluation from './CreditEvaluation';
import FinancialLiteracy from './FinancialLiteracy';
import AlternativeFunding from './AlternativeFunding';
import FundingRequestDetail from './FundingRequestDetail';
import ForgotPasswordOTP from './ForgotPasswordOTP';
import ResetPassword from './ResetPassword';
import AdminDashboard from './AdminDashboard';
import Footer from './Footer';

function AppContent({ user, onLogout, handleAuthSuccess, token }) {
  const location = useLocation();
  return (
    <>
      <NavBar user={user} onLogout={onLogout} />
      <div className="container flex-grow-1 mt-4 mb-5 pb-5">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/credit-evaluation" element={<CreditEvaluation />} />
              <Route path="/financial-literacy" element={<FinancialLiteracy />} />
              <Route path="/alternative-funding" element={<AlternativeFunding />} />
              <Route
                path="/auth"
                element={user ? <Navigate to="/dashboard" /> : <Auth onAuthSuccess={handleAuthSuccess} />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard user={user} token={token} /> : <Navigate to="/auth" />}
              />
              <Route path="/funding/:id" element={<FundingRequestDetail />} />
              <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route
                path="/admin"
                element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
              />
              <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (loggedInUser, authToken) => {
    setUser(loggedInUser);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <AppContent user={user} token={token} onLogout={handleLogout} handleAuthSuccess={handleAuthSuccess} />
      </Router>
    </div>
  );
}

export default App;
