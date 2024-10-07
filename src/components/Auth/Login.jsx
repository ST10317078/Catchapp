import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './auth.css'; // Ensure your CSS styles are applied

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in');
      navigate('/profile');
    } catch (err) {
      setError('Failed to login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/catchlogofull-removebg-preview.png" alt="App Logo" className="login-logo" /> {/* Add the logo */}
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
          <p className="login-text">
            Don't have an account? <Link to="/register" className="login-link">Click here to register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
