// client/src/ResetPassword.js
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from './axiosInstance';

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccessful, setResetSuccessful] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { newPassword });
      setMessage(res.data.message || 'Password reset successful!');
      setResetSuccessful(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Setting...' : 'Set New Password'}
        </button>
      </form>
      {loading && (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {message && <p className="mt-3">{message}</p>}
      {resetSuccessful && (
        <div className="mt-3">
          <Link to="/auth" className="btn btn-link">
            Click here to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
