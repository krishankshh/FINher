// client/src/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user, token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    entrepreneurName: '',
    amountRequested: '',
    purpose: '',
    description: '',
    contactPhone: '',
    contactAddress: ''
  });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch user-specific funding requests
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/my-funding-requests', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching your funding requests:', err);
        setLoading(false);
      });
  }, [token]);

  // Helper: reload user requests
  const reloadRequests = () => {
    setLoading(true);
    axios
      .get('/api/my-funding-requests', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching your funding requests:', err);
        setLoading(false);
      });
  };

  // Success/error messages with animation
  const showSuccessMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };
  const showErrorMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Reset the form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      entrepreneurName: '',
      amountRequested: '',
      purpose: '',
      description: '',
      contactPhone: '',
      contactAddress: ''
    });
  };

  // Submit: create or update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      axios
        .put(`/api/funding-requests/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          showSuccessMessage('Funding request updated successfully!');
          resetForm();
          reloadRequests();
        })
        .catch((err) => {
          showErrorMessage('Error updating funding request.');
          console.error(err);
        });
    } else {
      // Create
      axios
        .post('/api/funding-requests', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          showSuccessMessage('Funding request created successfully!');
          resetForm();
          reloadRequests();
        })
        .catch((err) => {
          showErrorMessage('Error creating funding request.');
          console.error(err);
        });
    }
  };

  // Edit a request
  const handleEdit = (request) => {
    setEditingId(request._id);
    setFormData({
      entrepreneurName: request.entrepreneurName,
      amountRequested: request.amountRequested,
      purpose: request.purpose,
      description: request.description,
      contactPhone: request.contactPhone,
      contactAddress: request.contactAddress
    });
  };

  // Delete a request
  const handleDelete = (id) => {
    axios
      .delete(`/api/funding-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        showSuccessMessage('Funding request deleted successfully!');
        reloadRequests();
      })
      .catch((err) => {
        showErrorMessage('Error deleting funding request.');
        console.error(err);
      });
  };

  return (
    <div className="container">
      <h2 className="mt-3">Welcome, {user.name}!</h2>
      {message && (
        <div className="animate__animated animate__fadeIn mt-3 text-success text-end">
          {message}
        </div>
      )}
      <div className="row">
        {/* Left Column: Form */}
        <div className="col-md-8">
          <h4>{editingId ? 'Edit Funding Request' : 'Create a New Funding Request'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Entrepreneur Name:</label>
              <input
                type="text"
                name="entrepreneurName"
                className="form-control"
                value={formData.entrepreneurName}
                onChange={(e) =>
                  setFormData({ ...formData, entrepreneurName: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, amountRequested: e.target.value })
                }
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
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label>Description:</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* 
              Contact Phone: 
              - type="tel" so it can show numeric keypad on mobile
              - pattern="[0-9]{10}" ensures exactly 10 digits
              - maxLength="10" to prevent more than 10 characters
              - onChange sanitizes non-digit chars
            */}
            <div className="mb-3">
              <label>Contact Phone (10 digits only):</label>
              <input
                type="tel"
                name="contactPhone"
                pattern="[0-9]{10}"
                maxLength="10"
                title="Please enter exactly 10 digits"
                className="form-control"
                value={formData.contactPhone}
                onChange={(e) => {
                  // Remove any non-digit characters
                  const sanitized = e.target.value.replace(/\D/g, '');
                  setFormData((prev) => ({ ...prev, contactPhone: sanitized }));
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label>Contact Address:</label>
              <input
                type="text"
                name="contactAddress"
                className="form-control"
                value={formData.contactAddress}
                onChange={(e) =>
                  setFormData({ ...formData, contactAddress: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              {editingId ? 'Update Request' : 'Create Request'}
            </button>
          </form>
        </div>

        {/* Right Column: List of funding requests */}
        <div className="col-md-4">
          <h4>Your Funding Requests</h4>
          {loading ? (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <p>No funding requests found.</p>
          ) : (
            <ul className="list-group">
              {requests.map((req) => (
                <li key={req._id} className="list-group-item">
                  <strong>{req.entrepreneurName}</strong>
                  <br />
                  Amount: {req.amountRequested}
                  <br />
                  Purpose: {req.purpose}
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(req)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(req._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
