import React from 'react';
import './ChatList.css'; // Add your CSS styles for chat list

const ChatList = ({ pinnedChats, onUserSelect, searchTerm, setSearchTerm, searchUsers, searchResults, pinChat }) => {
  return (
    <div className="chat-list">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          searchUsers(e.target.value); // Call searchUsers on input change
        }}
        className="search-input"
      />


      {/* Render search results if any */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="user-search-result"
              onClick={() => {
                onUserSelect(user);
                pinChat(user); // Pin chat once user is selected
              }}
            >
              <img
                src={user.profilePicUrl || 'https://via.placeholder.com/40'}
                alt="Profile"
                className="search-profile-pic"
              />
              <span className="search-username">{user.username}</span>
            </div>
          ))}
        </div>
      )}


<h3>Pinned Chats</h3>
      {pinnedChats.length > 0 ? (
        pinnedChats.map((user) => (
          <div
            key={user.id}
            className="pinned-chat"
            onClick={() => onUserSelect(user)}
          >
            <img
              src={user.profilePicUrl || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="chat-profile-pic"
            />
            <span className="chat-username">{user.username}</span>
          </div>
        ))
      ) : (
        <p>No pinned chats</p>
      )}
    </div>
  );
};

export default ChatList;
