// client/src/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand" to="/">FinHER</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navMenu" 
          aria-controls="navMenu" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/credit-evaluation">Credit Eval</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/financial-literacy">Financial Literacy</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/alternative-funding">Alt Funding</Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Panel</Link>
              </li>
            )}
            {!user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/auth">Login / Register</Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
