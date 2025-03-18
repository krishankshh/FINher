import React, { useState } from 'react';
import axios from 'axios';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        setMessage(`Login successful! Welcome ${res.data.user.name}`);
        onAuthSuccess(res.data.user, res.data.token);
      } else {
        // REGISTER
        const res = await axios.post('/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        setMessage(`Registration successful! Welcome ${res.data.user.name}`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mt-4">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        {!isLogin && (
          <div className="mb-3">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {message && <p className="mt-3 text-center text-success">{message}</p>}
      <div className="text-center mt-2">
        <button onClick={toggleMode} className="btn btn-link">
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
