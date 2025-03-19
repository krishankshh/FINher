// client/src/FinancialLiteracy.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FinancialLiteracy() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For searching
  const [searchTerm, setSearchTerm] = useState('');

  // For creating new resource
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resourceType: 'article',
    url: ''
  });

  // If token is in localStorage, user is logged in
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchResources('');
  }, []);

  const fetchResources = async (term) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/financial-literacy?search=${encodeURIComponent(term)}`);
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Error fetching resources');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources(searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle creating resource
  const handleCreateResource = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Must have "Bearer <token>"
      const res = await axios.post('/api/financial-literacy', newResource, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Insert at front
      setResources(prev => [res.data, ...prev]);
      // Reset form
      setNewResource({
        title: '',
        description: '',
        resourceType: 'article',
        url: ''
      });
    } catch (err) {
      console.error('Error creating resource:', err);
      setError('Error creating resource');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-4">
      <h2>Financial Literacy Resources</h2>
      {error && <p className="text-danger">{error}</p>}

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-3" style={{ maxWidth: '400px' }}>
        <label className="form-label">Search Resources:</label>
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by title or description..."
        />
        <button type="submit" className="btn btn-secondary mt-2">
          Search
        </button>
      </form>

      {loading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {resources.length === 0 ? (
            <p>No resources found.</p>
          ) : (
            <div className="row">
              {resources.map(resource => (
                <div className="col-md-6 mb-3" key={resource._id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{resource.title}</h5>
                      <p className="card-text">{resource.description}</p>
                      <p><strong>Type:</strong> {resource.resourceType}</p>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary me-2"
                        >
                          Access Resource
                        </a>
                      )}
                      {resource.createdBy && (
                        <p className="mt-2 mb-0">
                          <small>Created by: <strong>{resource.createdBy.name}</strong></small>
                        </p>
                      )}
                      <p className="mb-0">
                        <small>On: {new Date(resource.createdAt).toLocaleString()}</small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Only show form if token is present (user logged in) */}
          {token && (
            <>
              <hr />
              <h4>Add a New Resource</h4>
              <form onSubmit={handleCreateResource}>
                <div className="mb-3">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={newResource.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={newResource.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Resource Type:</label>
                  <select
                    name="resourceType"
                    className="form-select"
                    value={newResource.resourceType}
                    onChange={handleChange}
                    required
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="course">Course</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label>URL:</label>
                  <input
                    type="url"
                    name="url"
                    className="form-control"
                    value={newResource.url}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Add Resource
                </button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default FinancialLiteracy;
