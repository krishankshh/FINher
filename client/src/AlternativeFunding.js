// client/src/AlternativeFunding.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AlternativeFunding() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get('/api/funding-options')
      .then(res => setOptions(res.data))
      .catch(err => console.error('Error fetching options:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Alternative Financing Options</h2>
      {options.length === 0 ? (
        <p>No alternative funding options available at the moment.</p>
      ) : (
        <div className="row">
          {options.map(option => (
            <div className="col-md-4 mb-3" key={option._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{option.type}</h5>
                  <p className="card-text">{option.description}</p>
                  {option.link && (
                    <a href={option.link} target="_blank" rel="noopener noreferrer" className="btn btn-info">
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

export default AlternativeFunding;
