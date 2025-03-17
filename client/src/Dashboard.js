// client/src/Dashboard.js
import React, { useState } from 'react';
import axios from 'axios';

function Dashboard({ user, token }) {
  const [formData, setFormData] = useState({
    entrepreneurName: '',
    amountRequested: '',
    purpose: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/funding-requests', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setMessage('Funding request created successfully!');
      setFormData({ entrepreneurName: '', amountRequested: '', purpose: '' });
    })
    .catch((err) => {
      setMessage('Error creating funding request.');
      console.error(err);
    });
  };

  return (
    <div>
      <h2 className="mt-3">Welcome, {user.name}!</h2>
      <h3>Create a New Funding Request</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label>Entrepreneur Name:</label>
          <input
            type="text"
            name="entrepreneurName"
            className="form-control"
            value={formData.entrepreneurName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Amount Requested:</label>
          <input
            type="number"
            name="amountRequested"
            className="form-control"
            value={formData.amountRequested}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Purpose:</label>
          <input
            type="text"
            name="purpose"
            className="form-control"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-success" type="submit">
          Create Funding Request
        </button>
      </form>
      {message && <p className="mt-3 text-success">{message}</p>}
    </div>
  );
}

export default Dashboard;
