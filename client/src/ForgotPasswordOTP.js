// client/src/ForgotPasswordOTP.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPasswordOTP() {
  // Step 1: user enters email
  // Step 2: user enters OTP + new password
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccessful, setResetSuccessful] = useState(false);

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResetSuccessful(false);

    try {
      const res = await axios.post('/api/auth/send-otp', { email });
      setMessage(res.data.message || 'OTP sent successfully');
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResetSuccessful(false);

    try {
      const res = await axios.post('/api/auth/verify-otp', {
        email,
        otpCode,
        newPassword
      });
      setMessage(res.data.message || 'Password reset successful!');
      // If the response indicates success, show the "Go to Login" button
      if ((res.data.message || '').toLowerCase().includes('successful')) {
        setResetSuccessful(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2>Forgot Password (OTP)</h2>

      {/* Step 1: user enters email */}
      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <div className="mb-3">
            <label className="form-label">Enter your email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {/* Step 2: user enters OTP & new password */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-3">
            <label className="form-label">OTP Code</label>
            <input
              type="text"
              className="form-control"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Reset'}
          </button>
        </form>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Message */}
      {message && <p className="mt-3">{message}</p>}

      {/* If reset was successful, show a button to navigate to Login */}
      {resetSuccessful && (
        <div className="mt-3">
          <Link to="/auth" className="btn btn-link">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordOTP;
