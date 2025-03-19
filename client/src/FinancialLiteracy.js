// client/src/FinancialLiteracy.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FinancialLiteracy() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Optional: form state for creating a new resource
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resourceType: 'article',
    url: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/financial-literacy');
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Error fetching resources');
    } finally {
      setLoading(false);
    }
  };

  // Handler for creating a new resource
  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/financial-literacy', newResource);
      setResources(prev => [...prev, res.data]); // Add the newly created resource to the list
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
      {loading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Display Existing Resources */}
          {resources.length === 0 ? (
            <p>No resources available at the moment.</p>
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
                          className="btn btn-primary"
                        >
                          Access Resource
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* (Optional) Form to Create a New Resource */}
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
    </div>
  );
}

export default FinancialLiteracy;
