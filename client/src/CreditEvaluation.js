// client/src/CreditEvaluation.js
import React, { useState } from 'react';
import axios from './axiosInstance';

function CreditEvaluation() {
  const [formData, setFormData] = useState({
    entrepreneurName: '',
    amountRequested: '',
    purpose: '',
    businessRevenue: '',
    businessAge: '',
    collateralValue: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post('/api/credit-evaluation', formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error evaluating credit');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2>Robust AI Credit Evaluation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Entrepreneur Name:</label>
          <input
            type="text"
            name="entrepreneurName"
            className="form-control"
            value={formData.entrepreneurName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Amount Requested (₹):</label>
          <input
            type="number"
            name="amountRequested"
            className="form-control"
            value={formData.amountRequested}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Purpose:</label>
          <input
            type="text"
            name="purpose"
            className="form-control"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Annual Business Revenue (₹):</label>
          <input
            type="number"
            name="businessRevenue"
            className="form-control"
            value={formData.businessRevenue}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Business Age (Years):</label>
          <input
            type="number"
            name="businessAge"
            className="form-control"
            value={formData.businessAge}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Collateral Value (₹):</label>
          <input
            type="number"
            name="collateralValue"
            className="form-control"
            value={formData.collateralValue}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Evaluating...' : 'Evaluate Credit'}
        </button>
      </form>
      
      {loading && (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && <p className="mt-3 text-danger">{error}</p>}
      
      {result && (
        <div className="mt-3">
          <h4>Credit Score: {result.creditScore}</h4>
          <p>Recommendation: {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default CreditEvaluation;
