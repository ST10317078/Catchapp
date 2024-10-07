import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // To navigate after registration
import { auth } from '../../firebase';
import './auth.css'; // Reuse the same styles

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with the username
      await updateProfile(user, { displayName: username });

      // After registration, navigate to the profile page
      navigate('/ProfilePage');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/catchlogofull-removebg-preview.png" alt="App Logo" className="login-logo" /> {/* Add logo */}
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Register</h2>
          {error && <p className="error-message">{error}</p>}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
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
          <button type="submit" className="login-button">Register</button>
          <p className="login-text">
            Already have an account? <a href="/" className="login-link">Back to login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
