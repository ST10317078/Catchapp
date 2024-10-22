import React, { useState } from 'react';
import './ChatList.css'; // Add your CSS styles for the chat list

const ChatList = ({ pinnedChats, onUserSelect, onPinChat, users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list">
      <h2>Pinned Chats</h2>
      <div className="pinned-chats">
        {pinnedChats.map((user) => (
          <div key={user.id} className="chat-item" onClick={() => onUserSelect(user)}>
            <img src={user.profilePicUrl} alt="Profile" className="chat-profile-pic" />
            <span>{user.username}</span>
          </div>
        ))}
      </div>

      <h2>Search Users</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        className="search-input"
      />

      <h2>Users</h2>
      {filteredUsers.map((user) => (
        <div key={user.id} className="chat-item" onClick={() => { onUserSelect(user); onPinChat(user); }}>
          <img src={user.profilePicUrl} alt="Profile" className="chat-profile-pic" />
          <span>{user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
