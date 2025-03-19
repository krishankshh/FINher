// client/src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [fundingRequests, setFundingRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Retrieve token from localStorage so we can send it in headers
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all funding requests
      const reqRes = await axios.get('/api/funding-requests');
      // Fetch all financial literacy resources
      const litRes = await axios.get('/api/financial-literacy');
      setFundingRequests(reqRes.data);
      setResources(litRes.data);
    } catch (err) {
      console.error('AdminDashboard fetch error:', err);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Delete a funding request
  const handleDeleteRequest = async (id) => {
    try {
      await axios.delete(`/api/funding-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove it from the list
      setFundingRequests(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting funding request:', err);
      setError('Error deleting funding request');
    }
  };

  // Delete a financial literacy resource
  const handleDeleteResource = async (id) => {
    try {
      await axios.delete(`/api/financial-literacy/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove it from the list
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
          {/* Funding Requests Section */}
          <h4>All Funding Requests</h4>
          {fundingRequests.length === 0 ? (
            <p>No funding requests found.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Entrepreneur</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Description</th>
                  <th>Created By</th>
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
                    <td>{req.createdBy || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteRequest(req._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <hr />

          {/* Financial Literacy Resources Section */}
          <h4>All Financial Literacy Resources</h4>
          {resources.length === 0 ? (
            <p>No resources found.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>URL</th>
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(r => (
                  <tr key={r._id}>
                    <td>{r.title}</td>
                    <td>{r.description}</td>
                    <td>{r.resourceType}</td>
                    <td>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td>{r.createdBy?.name || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteResource(r._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
