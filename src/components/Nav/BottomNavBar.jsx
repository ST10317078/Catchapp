import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNavBar.css'; // Import the CSS for styling the navbar

const BottomNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-navbar">
      <div className="nav-item" onClick={() => navigate('/ChatPage')}>
        <i className="fas fa-comment"></i>
        <span>Chats</span>
      </div>

      <div className="nav-item" onClick={() => navigate('/community')}>
        <i className="fas fa-users"></i>
        <span>Community</span>
      </div>

      <div className="nav-item add-memory" onClick={() => navigate('/addMemory')}>
        <i className="fas fa-plus-circle"></i>
        <span>Add</span>
      </div>

      <div className="nav-item" onClick={() => navigate('/MemoriesPage')}>
        <i className="fas fa-book"></i>
        <span>Memories</span>
      </div>

      <div className="nav-item" onClick={() => navigate('/ProfilePage')}>
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </div>
    </div>
  );
};

export default BottomNavbar;
