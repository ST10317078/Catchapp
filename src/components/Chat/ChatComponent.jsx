import React, { useState } from 'react';
import './ChatComponent.css'; // Import the CSS styles for the chat component

const ChatComponent = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Mock chat history

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { sender: 'You', message }]);
      setMessage(''); // Clear input field after sending message
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img
          src={selectedUser.profilePicUrl || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="chat-profile-pic"
        />
        <span className="chat-username">{selectedUser.username}</span>
      </div>

      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
