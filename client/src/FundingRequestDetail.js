import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FundingRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/funding-requests/${id}`)
      .then(res => setRequest(res.data))
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.message || 'Error fetching details');
      });
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!request) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{request.entrepreneurName}'s Funding Request</h2>
      <p><strong>Amount Requested:</strong> {request.amountRequested}</p>
      <p><strong>Purpose:</strong> {request.purpose}</p>
      <p><strong>Description:</strong> {request.description}</p>
      <p><strong>Contact Phone:</strong> {request.contactPhone}</p>
      <p><strong>Contact Address:</strong> {request.contactAddress}</p>
      <p><em>Created at: {new Date(request.createdAt).toLocaleString()}</em></p>
    </div>
  );
}

export default FundingRequestDetail;
