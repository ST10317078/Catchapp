import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase'; // Import Firestore instance
import './ChatPage.css'; // Import styles

const ChatComponent = ({ selectedUser, currentUserId, onPinChat }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Mock chat history

  const handleSendMessage = async () => {
    if (message.trim() && currentUserId && selectedUser.id) {
      const chatMessage = {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        message,
        timestamp: new Date(),
      };

      // Append to local chat history
      setChatHistory([...chatHistory, { sender: 'You', message }]);

      // Save message to Firestore (example path, adjust according to your structure)
      const chatDocRef = doc(db, 'chats', `${currentUserId}_${selectedUser.id}`);
      await updateDoc(chatDocRef, {
        messages: arrayUnion(chatMessage),
      });

      // Pin chat
      await pinSenderToReceiver(selectedUser.id, currentUserId);

      setMessage(''); // Clear input after sending
    }
  };

  // Pin chat function
  const pinSenderToReceiver = async (receiverId, senderId) => {
    const receiverDocRef = doc(db, 'users', receiverId); // Reference to the receiver's user document
    await updateDoc(receiverDocRef, {
      pinnedChats: arrayUnion(senderId),
    });
    onPinChat(selectedUser);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={selectedUser.profilePicUrl || 'https://via.placeholder.com/50'} alt="Profile" />
        <span>{selectedUser.username}</span>
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
