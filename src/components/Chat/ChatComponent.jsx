import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import './ChatComponent.css'; // Your CSS styles for chat
import { db } from '../../firebase'; // Your Firestore setup

const ChatComponent = ({ selectedUser, currentUserId, onPinChat }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Mock chat history

  useEffect(() => {
    // Fetch chat history when selectedUser changes (can be updated with actual Firestore fetching logic)
    if (selectedUser && selectedUser.id) {
      console.log("Fetching chat history for user: ", selectedUser.id);
      // Fetch chat history from Firestore here if needed
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    // Ensure the message, currentUserId, and selectedUser are all defined
    if (!message.trim()) {
      console.error("Message is empty");
      return;
    }
    if (!currentUserId) {
      console.error("Current user ID is undefined");
      return;
    }
    if (!selectedUser || !selectedUser.id) {
      console.error("Selected user or their ID is undefined");
      return;
    }

    const newMessage = {
      senderId: currentUserId,
      receiverId: selectedUser.id,
      message,
      timestamp: new Date(),
    };

    try {
      // Send message to Firestore
      await sendMessageToChat(newMessage, currentUserId, selectedUser.id);

      // Update local chat history
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);

      // Automatically pin the sender to the receiver's pinned chat list
      await pinSenderToReceiver(selectedUser.id, currentUserId);

      // Pin the chat in the current user's chat list
      onPinChat(selectedUser);

      setMessage(''); // Clear input field after sending
    } catch (error) {
      console.error("Error sending message or pinning chat:", error);
    }
  };

  const sendMessageToChat = async (newMessage, senderId, receiverId) => {
    const chatDocRef = doc(db, 'chats', `${senderId}_${receiverId}`);
    const receiverChatDocRef = doc(db, 'chats', `${receiverId}_${senderId}`);

    if (newMessage) {
      await setDoc(chatDocRef, {
        messages: arrayUnion(newMessage),
      }, { merge: true });

      await setDoc(receiverChatDocRef, {
        messages: arrayUnion(newMessage),
      }, { merge: true });
    }
  };

  const pinSenderToReceiver = async (receiverId, senderId) => {
    const receiverDocRef = doc(db, 'users', receiverId);

    if (senderId) {
      await updateDoc(receiverDocRef, {
        pinnedChats: arrayUnion(senderId),
      });
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img
          src={selectedUser?.profilePicUrl || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="chat-profile-pic"
        />
        <span className="chat-username">{selectedUser?.username || 'Unknown User'}</span>
      </div>

      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <strong>{chat.senderId === currentUserId ? 'You' : selectedUser.username}:</strong> {chat.message}
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
