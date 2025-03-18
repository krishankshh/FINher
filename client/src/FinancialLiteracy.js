import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FinancialLiteracy() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get('/api/financial-literacy')
      .then(res => setResources(res.data))
      .catch(err => console.error('Error fetching resources:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Financial Literacy Programs</h2>
      {resources.length === 0 ? (
        <p>No resources available at the moment.</p>
      ) : (
        <div className="row">
          {resources.map(resource => (
            <div className="col-md-4 mb-3" key={resource._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{resource.title}</h5>
                  <p className="card-text">{resource.description}</p>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FinancialLiteracy;
