import React, { useState, useEffect } from 'react';
import axios from './axiosInstance';

function FundingRequests() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    entrepreneurName: '',
    amountRequested: '',
    purpose: ''
  });

  // 1. Fetch all requests when the component first mounts
  useEffect(() => {
    axios.get('/api/funding-requests')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching funding requests:', error);
      });
  }, []);

  // 2. Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle form submission (create a new request)
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/funding-requests', formData)
      .then((response) => {
        // Append the new request to our existing list
        setRequests((prev) => [...prev, response.data]);

        // Clear the form
        setFormData({
          entrepreneurName: '',
          amountRequested: '',
          purpose: ''
        });
      })
      .catch((error) => {
        console.error('Error creating funding request:', error);
      });
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Funding Requests</h2>

      {/* Form to create a new funding request */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Entrepreneur Name: </label>
          <input
            type="text"
            name="entrepreneurName"
            value={formData.entrepreneurName}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Amount Requested: </label>
          <input
            type="number"
            name="amountRequested"
            value={formData.amountRequested}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Purpose: </label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Create Funding Request</button>
      </form>

      {/* Display existing funding requests */}
      <h3>Existing Requests:</h3>
      <ul>
        {requests.map((req) => (
          <li key={req._id} style={{ marginBottom: '15px' }}>
            <strong>{req.entrepreneurName}</strong> - {req.amountRequested}  
            <br />
            Purpose: {req.purpose}
            <br />
            <em>Created at: {new Date(req.createdAt).toLocaleString()}</em>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FundingRequests;
