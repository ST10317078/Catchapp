import React, { useState, useEffect } from 'react';
import './ChatPage.css'; // Import your styles

const ChatList = ({ users, pinnedChats, onUserSelect, currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query
  const filteredUsers = users.filter((user) => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-list">
      <div className="chat-list-header">Chat</div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pinned-chats">
        <h4>Pinned Chats</h4>
        {pinnedChats.map((user) => (
          <div 
            key={user.id} 
            className="chat-list-item"
            onClick={() => onUserSelect(user)}
          >
            <img src={user.profilePicUrl || 'https://via.placeholder.com/40'} alt="Profile" />
            <span>{user.username}</span>
          </div>
        ))}
      </div>

      <div className="all-users">
        <h4>All Users</h4>
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="chat-list-item"
            onClick={() => onUserSelect(user)}
          >
            <img src={user.profilePicUrl || 'https://via.placeholder.com/40'} alt="Profile" />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

