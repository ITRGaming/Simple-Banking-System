import React, { useState, useEffect } from 'react';
import { Building2, Users, Lock, User, ChevronRight } from 'lucide-react';
import api from '../Api/apis';
import '../style.css';

function Login() {
  const [role, setrole] = useState('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle login logic here
    const response = await api.login(username, password, role);
    console.log('Login response:', response);
    if (response.token) {
      response.token && localStorage.setItem('token', response.token);
      window.location.href = `/${role}`;
      setError('');
    }else if (response.status === 404) {
      setError('Invalid username');
    }else if (response.status === 401) {
      setError('Invalid password');
    }
    
  };

  return (
    <div className="container">
      <div className="login-card">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="logo-container">
            <Building2 className="logo" />
          </div>
          <h2 className="title">Enpointe.io</h2>
          <p className="subtitle">Please sign in to your account</p>
        </div>

        {/* User Type Selection */}
        <div className="user-type-container">
          <button
            onClick={() => setrole('customer')}
            className={`user-type-button ${role === 'customer' ? 'active' : ''}`}
          >
            <Users className="icon" />
            Customer
          </button>
          <button
            onClick={() => setrole('banker')}
            className={`user-type-button ${role === 'banker' ? 'active' : ''}`}
          >
            <Building2 className="icon" />
            Banker
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="username">
              Username
            </label>
            <div className="input-container">
              <User className="input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder={role === 'customer' ? 'Customer ID' : 'Employee ID'}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Sign in
            <ChevronRight className="icon" />
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        {/* Footer */}
        <div className="footer">
          Protected by industry-leading security protocols
        </div>
      </div>
    </div>
  );
}

export default Login;