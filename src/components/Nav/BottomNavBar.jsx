import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavBar.css'; // Create a CSS file for styles

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <div className="bottom-navbar">
      <Link to="/ChatPage" className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}>
        <i className="nav-icon fas fa-comments"></i>
        <span></span>
      </Link>
      <Link to="/communities" className={`nav-item ${location.pathname === '/communities' ? 'active' : ''}`}>
        <i className="nav-icon fas fa-users"></i>
        <span></span>
      </Link>
      <Link to="/addMemory" className={`nav-item ${location.pathname === '/addMemory' ? 'active' : ''}`}>
        <i className="nav-icon fas fa-plus-circle"></i>
        <span></span>
      </Link>
      <Link to="/MemoriesPage" className={`nav-item ${location.pathname === '/MemoriesPage' ? 'active' : ''}`}>
        <i className="nav-icon fas fa-images"></i>
        <span></span>
      </Link>
      <Link to="/ProfilePage" className={`nav-item ${location.pathname === '/ProfilePage' ? 'active' : ''}`}>
        <i className="nav-icon fas fa-user"></i>
        <span></span>
      </Link>
    </div>
  );
};

export default BottomNavBar;
