// client/src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [fundingRequests, setFundingRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const fundingRes = await axios.get('/api/funding-requests');
      const resourceRes = await axios.get('/api/financial-literacy');
      setFundingRequests(fundingRes.data);
      setResources(resourceRes.data);
    } catch (err) {
      console.error('AdminDashboard fetch error:', err);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFunding = async (id) => {
    try {
      await axios.delete(`/api/funding-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFundingRequests(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting funding request:', err);
      setError('Error deleting funding request');
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await axios.delete(`/api/financial-literacy/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError('Error deleting resource');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <h4>Funding Requests</h4>
          {fundingRequests.length === 0 ? (
            <p>No funding requests available.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Entrepreneur</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fundingRequests.map(req => (
                  <tr key={req._id}>
                    <td>{req.entrepreneurName}</td>
                    <td>{req.amountRequested}</td>
                    <td>{req.purpose}</td>
                    <td>{req.description}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFunding(req._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <hr />

          <h4>Financial Literacy Resources</h4>
          {resources.length === 0 ? (
            <p>No resources available.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(res => (
                  <tr key={res._id}>
                    <td>{res.title}</td>
                    <td>{res.description}</td>
                    <td>{res.resourceType}</td>
                    <td>{res.createdBy?.name || 'N/A'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteResource(res._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4">
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
