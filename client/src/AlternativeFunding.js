// client/src/AlternativeFunding.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AlternativeFunding() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/funding-options')
      .then(res => {
        setOptions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching alternative funding options:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Alternative Financing Channels</h2>
      {loading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : options.length === 0 ? (
        <p>No alternative funding options available at the moment.</p>
      ) : (
        <div className="row">
          {options.map((option) => (
            <div className="col-md-6 mb-3" key={option._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{option.name}</h5>
                  <p className="card-text">{option.description}</p>
                  {option.eligibility && (
                    <p className="card-text"><strong>Eligibility:</strong> {option.eligibility}</p>
                  )}
                  {option.applicationLink && (
                    <a href={option.applicationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Apply Now
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

export default AlternativeFunding;
