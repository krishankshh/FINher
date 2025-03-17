// client/src/CreditEvaluation.js
import React, { useState } from 'react';
import axios from 'axios';

function CreditEvaluation() {
  const [formData, setFormData] = useState({
    entrepreneurName: '',
    amountRequested: '',
    purpose: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/credit-evaluation', formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error evaluating credit');
    }
  };

  return (
    <div className="container mt-4">
      <h2>AI-Powered Credit Evaluation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Entrepreneur Name:</label>
          <input type="text" name="entrepreneurName" className="form-control" value={formData.entrepreneurName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Amount Requested:</label>
          <input type="number" name="amountRequested" className="form-control" value={formData.amountRequested} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Purpose:</label>
          <input type="text" name="purpose" className="form-control" value={formData.purpose} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Evaluate Credit</button>
      </form>
      {result && (
        <div className="mt-4">
          <h4>Credit Score: {result.creditScore}</h4>
          <p>Recommendation: {result.recommendation}</p>
        </div>
      )}
      {error && <p className="mt-4 text-danger">{error}</p>}
    </div>
  );
}

export default CreditEvaluation;
