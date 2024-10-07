import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If user is not logged in, redirect to login
    return <Navigate to="/" />;
  }

  // If user is logged in, render the children (the protected page)
  return children;
};

export default ProtectedRoute;
