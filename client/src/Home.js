// client/src/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios
      .get('/api/funding-requests')
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Error fetching requests:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Funding Requests</h2>
      <div className="row">
        {requests.map((req) => (
          <div className="col-md-4 mb-3" key={req._id}>
            <div className="card">
              {/* Image removed */}
              <div className="card-body">
                <h5 className="card-title">{req.entrepreneurName}</h5>
                <p className="card-text">
                  <strong>Amount:</strong> {req.amountRequested} <br />
                  <strong>Purpose:</strong> {req.purpose}
                </p>
                <Link to={`/funding/${req._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
